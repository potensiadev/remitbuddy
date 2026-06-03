const { Client } = require('@notionhq/client');

// API 키 하드코딩 (환경변수 우선, 없으면 기본값 사용)
const NOTION_API_KEY = process.env.NOTION_API_KEY || 'ntn_s74281941307zJZLvlmqLpvbUGg6TPAVZAguzsTyJbD5TK';

const notion = new Client({
  auth: NOTION_API_KEY,
});

// 데이터베이스 ID 하드코딩 (환경변수 우선, 없으면 기본값 사용)
const DATABASE_ID = process.env.BLOG_DATABASE_ID || '2d61bac13f5280a7a460f98df9036e4b';
const DATABASE_ID_KO = process.env.BLOG_DATABASE_ID_KO || '2d61bac13f5280a7a460f98df9036e4b';
const DATABASE_ID_EN = process.env.BLOG_DATABASE_ID_EN || '3081bac13f5281c589f4e9ccd21156dc';

// 모든 블록을 페이지네이션으로 가져오고, 중첩 블록도 재귀적으로 조회
async function getAllBlocks(blockId) {
  const blocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  // 중첩 블록(toggle, column, table 등)의 자식 재귀 조회
  for (const block of blocks) {
    if (block.has_children) {
      block.children = await getAllBlocks(block.id);
    }
  }

  return blocks;
}

const normalizeLocale = (locale = 'ko') => {
  if (typeof locale !== 'string') return 'ko';
  return locale.toLowerCase().startsWith('en') ? 'en' : 'ko';
};

const getDatabaseCandidatesByLocale = (locale = 'ko') => {
  const normalizedLocale = normalizeLocale(locale);
  const primary = normalizedLocale === 'en' ? DATABASE_ID_EN : DATABASE_ID_KO;
  const secondary = DATABASE_ID;
  const otherLocaleDatabase = normalizedLocale === 'en' ? DATABASE_ID_KO : DATABASE_ID_EN;

  // If locale-specific DB is configured, do NOT cross-fallback to the other locale.
  // (Prevents /blog showing Korean posts when English DB is intentionally empty.)
  if (primary) {
    return [...new Set([primary, secondary].filter(Boolean))];
  }

  // If locale-specific DB is not configured at all, allow broader fallback
  // to avoid empty pages during migration/misconfiguration.
  return [...new Set([secondary, otherLocaleDatabase].filter(Boolean))];
};

const getPlainText = (richText) => {
  if (!Array.isArray(richText)) return '';
  return richText.map((t) => t?.plain_text || '').join('');
};

const mapPost = (page) => {
  const props = page.properties || {};

  let cover = null;
  if (props.Image?.files && props.Image.files.length > 0) {
    const fileObj = props.Image.files[0];
    if (fileObj.type === 'external') {
      cover = fileObj.external.url;
    } else if (fileObj.type === 'file') {
      cover = `/api/image?pageId=${page.id}&type=property`;
    }
  }

  if (!cover && page.cover) {
    if (page.cover.type === 'external') {
      cover = page.cover.external.url;
    } else if (page.cover.type === 'file') {
      cover = `/api/image?pageId=${page.id}&type=cover`;
    }
  }

  const tags = props.Tags?.multi_select?.map((t) => t.name) || [];

  return {
    id: page.id,
    title: getPlainText(props.Name?.title),
    titleEn: getPlainText(props['Title (En)']?.rich_text),
    slug: getPlainText(props.Slug?.rich_text),
    excerpt: getPlainText(props.Excerpt?.rich_text),
    excerptEn: getPlainText(props['Excerpt (En)']?.rich_text),
    metaTitle: getPlainText(props['Meta Title']?.rich_text),
    metaDescription: getPlainText(props['Meta Description']?.rich_text),
    featured: props.Featured?.checkbox ?? false,
    publishedAt: props['Publish Date']?.date?.start || null,
    cover,
    tags,
  };
};

async function queryPublishedPosts(databaseId) {
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Ready to Publish',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Publish Date', direction: 'descending' }],
  });

  return res.results.map(mapPost).filter((p) => p.slug);
}

async function getPublishedPosts(locale = 'ko') {
  const databaseIds = getDatabaseCandidatesByLocale(locale);

  if (databaseIds.length === 0) {
    console.error(`[Notion] No blog database configured for locale: ${locale}`);
    return [];
  }

  for (const databaseId of databaseIds) {
    try {
      const posts = await queryPublishedPosts(databaseId);
      if (posts.length > 0) return posts;
    } catch (e) {
      console.error(`[Notion] getPublishedPosts failed for database ${databaseId}:`, e);
    }
  }

  console.warn(`[Notion] No published posts found for locale: ${locale}. Tried DBs: ${databaseIds.join(', ')}`);
  return [];
}

async function queryPostBySlug(databaseId, slug) {
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: 'Ready to Publish', checkbox: { equals: true } },
        { property: 'Slug', rich_text: { equals: slug } },
      ],
    },
    page_size: 1,
  });

  const page = res.results[0];
  if (!page) return null;

  // 모든 블록을 페이지네이션 + 중첩 블록 포함하여 가져오기
  const blocks = await getAllBlocks(page.id);

  return {
    ...mapPost(page),
    blocks,
  };
}

async function getPostBySlug(slug, locale = 'ko') {
  const databaseIds = getDatabaseCandidatesByLocale(locale);

  if (databaseIds.length === 0) {
    console.error(`[Notion] No blog database configured for locale: ${locale}`);
    return null;
  }

  for (const databaseId of databaseIds) {
    try {
      const post = await queryPostBySlug(databaseId, slug);
      if (post) return post;
    } catch (e) {
      console.error(`[Notion] getPostBySlug failed for database ${databaseId}:`, e);
    }
  }

  console.warn(`[Notion] Post not found for slug: ${slug} (locale: ${locale}). Tried DBs: ${databaseIds.join(', ')}`);
  return null;
}

/**
 * Get related posts based on tag similarity
 * @param {string} currentSlug - Current post slug to exclude
 * @param {string[]} tags - Tags of current post
 * @param {string} locale - Locale for database selection
 * @param {number} limit - Max number of related posts
 */
async function getRelatedPosts(currentSlug, tags = [], locale = 'ko', limit = 3) {
  try {
    const allPosts = await getPublishedPosts(locale);

    // Exclude current post
    const otherPosts = allPosts.filter(post => post.slug !== currentSlug);

    if (otherPosts.length === 0) return [];

    // Score posts by tag similarity
    const scoredPosts = otherPosts.map(post => {
      const matchingTags = post.tags.filter(tag => tags.includes(tag));
      return {
        ...post,
        score: matchingTags.length,
        matchingTags,
      };
    });

    // Sort by score (descending), then by publishedAt (descending)
    scoredPosts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
    });

    // Return top matches
    return scoredPosts.slice(0, limit).map(({ score, matchingTags, ...post }) => ({
      ...post,
      matchingTags, // Include for display purposes
    }));
  } catch (e) {
    console.error('[Notion] getRelatedPosts failed:', e);
    return [];
  }
}

module.exports = {
  getPublishedPosts,
  getPostBySlug,
  getRelatedPosts,
};
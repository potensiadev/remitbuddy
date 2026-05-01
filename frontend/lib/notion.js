const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.BLOG_DATABASE_ID;
const DATABASE_ID_KO = process.env.BLOG_DATABASE_ID_KO;
const DATABASE_ID_EN = process.env.BLOG_DATABASE_ID_EN;

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

module.exports = {
  getPublishedPosts,
  getPostBySlug,
};
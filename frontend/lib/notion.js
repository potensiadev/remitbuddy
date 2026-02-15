const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.BLOG_DATABASE_ID;
const DATABASE_ID_KO = process.env.BLOG_DATABASE_ID_KO;
const DATABASE_ID_EN = process.env.BLOG_DATABASE_ID_EN;

const normalizeLocale = (locale = 'ko') => {
  if (typeof locale !== 'string') return 'ko';
  return locale.toLowerCase().startsWith('en') ? 'en' : 'ko';
};

const getDatabaseCandidatesByLocale = (locale = 'ko') => {
  const normalizedLocale = normalizeLocale(locale);
  const primary = normalizedLocale === 'en' ? DATABASE_ID_EN : DATABASE_ID_KO;

  // Do not cross-fallback to the other locale DB.
  // Expected behavior: each locale shows only its own content,
  // with optional legacy single-DB fallback during migration.
  return [...new Set([primary, DATABASE_ID].filter(Boolean))];
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

  for (const databaseId of databaseIds) {
    try {
      const posts = await queryPublishedPosts(databaseId);
      if (posts.length > 0) return posts;
    } catch (e) {
      console.error(`[Notion] getPublishedPosts failed for database ${databaseId}:`, e);
    }
  }

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

  const blocksRes = await notion.blocks.children.list({
    block_id: page.id,
    page_size: 100,
  });

  return {
    ...mapPost(page),
    blocks: blocksRes.results || [],
  };
}

async function getPostBySlug(slug, locale = 'ko') {
  const databaseIds = getDatabaseCandidatesByLocale(locale);

  for (const databaseId of databaseIds) {
    try {
      const post = await queryPostBySlug(databaseId, slug);
      if (post) return post;
    } catch (e) {
      console.error(`[Notion] getPostBySlug failed for database ${databaseId}:`, e);
    }
  }

  return null;
}

module.exports = {
  getPublishedPosts,
  getPostBySlug,
};
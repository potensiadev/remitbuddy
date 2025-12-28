const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.BLOG_DATABASE_ID;

const getPlainText = (richText) => {
  if (!Array.isArray(richText)) return '';
  return richText.map((t) => t?.plain_text || '').join('');
};

const mapPost = (page) => {
  const props = page.properties || {};
  return {
    id: page.id,
    title: getPlainText(props.Name?.title),
    slug: getPlainText(props.Slug?.rich_text),
    excerpt: getPlainText(props.Excerpt?.rich_text),
    featured: props.Featured?.checkbox ?? false,
    publishedAt: props['Publish Date']?.date?.start || null,
  };
};

async function getPublishedPosts() {
  try {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Ready to Publish',
        checkbox: { equals: true },
      },
      sorts: [
        { property: 'Publish Date', direction: 'descending' },
      ],
    });

    return res.results.map(mapPost).filter((p) => p.slug);
  } catch (e) {
    console.error('[Notion] getPublishedPosts failed:', e);
    return [];
  }
}

async function getPostBySlug(slug) {
  try {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
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
  } catch (e) {
    console.error('[Notion] getPostBySlug failed:', e);
    return null;
  }
}

module.exports = {
  getPublishedPosts,
  getPostBySlug,
};
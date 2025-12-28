import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY || process.env.NOTION_API_KE,
});

const databaseId = process.env.BLOG_DATABASE_ID;

const getPlainText = (richText) => {
  if (!Array.isArray(richText)) {
    return '';
  }

  return richText.map((item) => item?.plain_text || '').join('');
};

const mapPost = (page) => ({
  title: getPlainText(page?.properties?.Title?.title),
  slug: getPlainText(page?.properties?.Slug?.rich_text),
  excerpt: getPlainText(page?.properties?.Excerpt?.rich_text),
  publishedAt: page?.properties?.['Publish Date']?.date?.start || null,
});

export async function getPublishedPosts() {
  if (!databaseId) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Ready to Publish',
        checkbox: { equals: true },
      },
      sorts: [
        {
          property: 'Publish Date',
          direction: 'descending',
        },
      ],
    });

    return response?.results?.map(mapPost) || [];
  } catch (error) {
    console.error('Failed to fetch published posts from Notion.', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  if (!databaseId || typeof slug !== 'string' || !slug) {
    return null;
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Ready to Publish',
            checkbox: { equals: true },
          },
          {
            property: 'Slug',
            rich_text: { equals: slug },
          },
        ],
      },
    });

    const page = response?.results?.[0];

    if (!page) {
      return null;
    }

    let blocks = [];

    try {
      const blocksResponse = await notion.blocks.children.list({
        block_id: page.id,
      });
      blocks = blocksResponse?.results || [];
    } catch (error) {
      console.error('Failed to fetch post blocks from Notion.', error);
      blocks = [];
    }

    return {
      ...mapPost(page),
      blocks,
    };
  } catch (error) {
    console.error('Failed to fetch post from Notion.', error);
    return null;
  }
}

import { Client } from '@notionhq/client';

const getNotionClient = () => {
  if (!process.env.NOTION_TOKEN) {
    throw new Error('NOTION_TOKEN is not defined');
  }

  return new Client({
    auth: process.env.NOTION_TOKEN,
  });
};

const getDatabaseId = () => {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error('NOTION_DATABASE_ID is not defined');
  }
  return process.env.NOTION_DATABASE_ID;
};

const notion = getNotionClient();

const parseText = (richText = []) => richText.map((item) => item.plain_text).join('');

const parseTitle = (property) => parseText(property?.title || []);

const parseRichText = (property) => parseText(property?.rich_text || []);

const parseCheckbox = (property) => property?.checkbox ?? null;

const parseCover = (page) => {
  if (page.cover?.external?.url) return page.cover.external.url;
  if (page.cover?.file?.url) return page.cover.file.url;

  const coverFile = page.properties?.Cover?.files?.[0];
  if (coverFile?.external?.url) return coverFile.external.url;
  if (coverFile?.file?.url) return coverFile.file.url;

  return null;
};

const mapPageToPost = (page) => {
  const properties = page.properties || {};
  const slug = parseRichText(properties.Slug) || page.id;
  const published = parseCheckbox(properties.Published);

  return {
    id: page.id,
    slug,
    title: parseTitle(properties.Name) || 'Untitled',
    description: parseRichText(properties.Description) || '',
    cover: parseCover(page),
    lastEdited: page.last_edited_time,
    published: published === null ? true : published,
  };
};

export const getPublishedPosts = async () => {
  const databaseId = getDatabaseId();
  let cursor = undefined;
  const results = [];

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
      sorts: [
        {
          timestamp: 'last_edited_time',
          direction: 'descending',
        },
      ],
      start_cursor: cursor,
      page_size: 100,
    });

    results.push(...(response.results || []));
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  const posts = results.map(mapPageToPost);
  return posts.filter((post) => post.slug && post.published);
};

const fetchBlockChildren = async (blockId) => {
  let cursor = undefined;
  const blocks = [];

  do {
    const { results = [], next_cursor: nextCursor } = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of results) {
      let children = [];
      if (block.has_children) {
        children = await fetchBlockChildren(block.id);
      }
      blocks.push({ ...block, children });
    }

    cursor = nextCursor;
  } while (cursor);

  return blocks;
};

export const getPostBySlug = async (slug) => {
  const posts = await getPublishedPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) {
    return null;
  }

  const blocks = await fetchBlockChildren(post.id);
  return { post, blocks };
};

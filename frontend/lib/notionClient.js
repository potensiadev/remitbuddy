const NOTION_VERSION = '2022-06-28';

const notionHeaders = () => {
  if (!process.env.NOTION_TOKEN) {
    throw new Error('NOTION_TOKEN is not defined');
  }

  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
};

const getDatabaseId = () => {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error('NOTION_DATABASE_ID is not defined');
  }
  return process.env.NOTION_DATABASE_ID;
};

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

const queryNotion = async (path, options = {}) => {
  const response = await fetch(`https://api.notion.com${path}`, {
    ...options,
    headers: {
      ...notionHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API request failed (${response.status}): ${error}`);
  }

  return response.json();
};

export const getPublishedPosts = async () => {
  const databaseId = getDatabaseId();
  const data = await queryNotion(`/v1/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  const posts = (data.results || []).map(mapPageToPost);
  return posts.filter((post) => post.slug && post.published);
};

const fetchBlockChildren = async (blockId) => {
  let cursor = undefined;
  const blocks = [];

  do {
    const params = cursor ? `?start_cursor=${cursor}` : '';
    const data = await queryNotion(`/v1/blocks/${blockId}/children${params}`, {
      method: 'GET',
    });

    for (const block of data.results || []) {
      let children = [];
      if (block.has_children) {
        children = await fetchBlockChildren(block.id);
      }
      blocks.push({ ...block, children });
    }

    cursor = data.next_cursor;
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

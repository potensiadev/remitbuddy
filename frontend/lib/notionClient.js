import { Client } from '@notionhq/client';

const NOTION_TIMEOUT_MS = Number(process.env.NOTION_REQUEST_TIMEOUT_MS || 10000);
const NOTION_MAX_RETRIES = Number(process.env.NOTION_MAX_RETRIES || 2);
const NOTION_RETRY_BASE_DELAY_MS = Number(process.env.NOTION_RETRY_BASE_DELAY_MS || 500);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const logError = (message, error, context = {}) => {
  console.error(`[Notion] ${message}`, {
    error,
    context,
  });
};

const createTimeoutFetch = (timeoutMs) => {
  return async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  };
};

const withRetry = async (operationName, fn) => {
  let attempt = 0;
  let delay = NOTION_RETRY_BASE_DELAY_MS;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      logError(`${operationName} failed`, error, { attempt });
      if (attempt >= NOTION_MAX_RETRIES) {
        throw error;
      }
      await sleep(delay);
      attempt += 1;
      delay *= 2;
    }
  }
};

const getNotionClient = () => {
  if (!process.env.NOTION_TOKEN) {
    throw new Error('NOTION_TOKEN is not defined');
  }

  return new Client({
    auth: process.env.NOTION_TOKEN,
    fetch: createTimeoutFetch(NOTION_TIMEOUT_MS),
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
  try {
    const databaseId = getDatabaseId();
    const response = await withRetry('Fetch published posts', () =>
      notion.databases.query({
        database_id: databaseId,
        sorts: [
          {
            timestamp: 'last_edited_time',
            direction: 'descending',
          },
        ],
      })
    );

    const posts = (response.results || []).map(mapPageToPost);
    return posts.filter((post) => post.slug && post.published);
  } catch (error) {
    logError('Unable to load published posts', error);
    return [];
  }
};

const fetchBlockChildren = async (blockId) => {
  let cursor = undefined;
  const blocks = [];

  do {
    const { results = [], next_cursor: nextCursor } = await withRetry('Fetch block children', () =>
      notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      })
    );

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
  try {
    const posts = await getPublishedPosts();
    const post = posts.find((item) => item.slug === slug);
    if (!post) {
      return null;
    }

    const blocks = await fetchBlockChildren(post.id);
    return { post, blocks };
  } catch (error) {
    logError('Unable to load post by slug', error, { slug });
    return null;
  }
};

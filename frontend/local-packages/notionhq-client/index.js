const DEFAULT_VERSION = '2022-06-28';

const buildHeaders = (auth, notionVersion) => {
  if (!auth) throw new Error('Notion auth token is required');
  return {
    Authorization: `Bearer ${auth}`,
    'Notion-Version': notionVersion,
    'Content-Type': 'application/json',
  };
};

class Client {
  constructor(options = {}) {
    const { auth, notionVersion = DEFAULT_VERSION, baseUrl = 'https://api.notion.com/v1' } = options;
    this.auth = auth;
    this.notionVersion = notionVersion;
    this.baseUrl = baseUrl.replace(/\/$/, '');

    this.databases = {
      query: async ({ database_id, ...payload }) =>
        this.#request(`/databases/${database_id}/query`, {
          method: 'POST',
          body: JSON.stringify(payload),
        }),
    };

    this.blocks = {
      children: {
        list: async ({ block_id, start_cursor, page_size }) => {
          const searchParams = new URLSearchParams();
          if (start_cursor) searchParams.set('start_cursor', start_cursor);
          if (page_size) searchParams.set('page_size', page_size);

          const query = searchParams.toString();
          const path = query ? `/blocks/${block_id}/children?${query}` : `/blocks/${block_id}/children`;
          return this.#request(path, { method: 'GET' });
        },
      },
    };
  }

  async #request(path, init) {
    const headers = buildHeaders(this.auth, this.notionVersion);
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    if (!response.ok) {
      const text = await response.text();
      const error = new Error(`Notion API request failed with status ${response.status}`);
      error.status = response.status;
      error.body = text;
      throw error;
    }
    return response.json();
  }
}

export { Client };
export default { Client };

// 디버깅용 - 확인 후 삭제 필요
const { Client } = require('@notionhq/client');

export default async function handler(req, res) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.BLOG_DATABASE_ID;

  try {
    // 1. 데이터베이스 직접 쿼리 (필터 없이)
    const allPages = await notion.databases.query({
      database_id: databaseId,
      page_size: 5,
    });

    // 2. Ready to Publish 필터로 쿼리
    const publishedPages = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Ready to Publish',
        checkbox: { equals: true },
      },
      page_size: 5,
    });

    res.status(200).json({
      success: true,
      databaseId,
      allPagesCount: allPages.results.length,
      allPages: allPages.results.map(p => ({
        id: p.id,
        title: p.properties.Name?.title?.[0]?.plain_text || 'No title',
        readyToPublish: p.properties['Ready to Publish']?.checkbox,
        slug: p.properties.Slug?.rich_text?.[0]?.plain_text || 'No slug',
      })),
      publishedPagesCount: publishedPages.results.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      databaseId,
    });
  }
}

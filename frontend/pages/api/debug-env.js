// 디버깅용 - 확인 후 삭제 필요
export default function handler(req, res) {
  const hasNotionKey = !!process.env.NOTION_API_KEY;
  const hasBlogDbId = !!process.env.BLOG_DATABASE_ID;

  // 보안을 위해 값 자체는 노출하지 않고 존재 여부만 확인
  res.status(200).json({
    NOTION_API_KEY: hasNotionKey ? '✅ 설정됨' : '❌ 없음',
    BLOG_DATABASE_ID: hasBlogDbId ? '✅ 설정됨' : '❌ 없음',
    BLOG_DATABASE_ID_preview: hasBlogDbId
      ? process.env.BLOG_DATABASE_ID.substring(0, 8) + '...'
      : null,
  });
}

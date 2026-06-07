// 디버깅용 - 확인 후 삭제 필요
import { getPublishedPosts } from '../../lib/notion';

export default async function handler(req, res) {
  try {
    const posts = await getPublishedPosts('en');
    res.status(200).json({
      success: true,
      postsCount: posts.length,
      posts: posts.map(p => ({ title: p.title, slug: p.slug })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}

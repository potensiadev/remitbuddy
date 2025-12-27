import Head from 'next/head';
import Link from 'next/link';
import { getPublishedPosts } from '../../lib/notionClient';

const BlogIndex = ({ posts }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Head>
        <title>RemitBuddy Blog</title>
        <meta name="description" content="Read the latest updates and insights from the RemitBuddy team." />
      </Head>
      <h1 className="text-4xl font-bold mb-8">Our Blog</h1>
      {posts.length === 0 && (
        <p className="text-gray-600">No posts are published yet. Please check back soon.</p>
      )}
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`}>
              <a className="block">
                <div className="flex items-center gap-4">
                  {post.cover && (
                    <img
                      src={post.cover}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-md border"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold text-brand-500 hover:text-brand-600">{post.title}</h2>
                    {post.description && <p className="text-gray-600 mt-2">{post.description}</p>}
                  </div>
                </div>
              </a>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  try {
    const posts = await getPublishedPosts();
    return {
      props: { posts },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Failed to load blog posts from Notion', error);
    return {
      props: { posts: [] },
      revalidate: 60,
    };
  }
};

export default BlogIndex;

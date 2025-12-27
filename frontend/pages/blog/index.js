import Head from 'next/head';
import Link from 'next/link';
import { getPublishedPosts } from '../../lib/notionClient';

const BlogIndex = ({ posts }) => {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <Head>
          <title>RemitBuddy Blog</title>
          <meta name="description" content="Read the latest updates and insights from the RemitBuddy team." />
        </Head>
        <header className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Insights</p>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Blog</h1>
          <p className="mt-4 text-lg text-gray-600">
            Product updates, remittance tips, and behind-the-scenes thinking from the RemitBuddy team.
          </p>
        </header>

        {posts.length === 0 && (
          <div className="rounded-2xl border border-gray-150 bg-white/80 p-6 text-center shadow-sm">
            <p className="text-gray-600">No posts are published yet. Please check back soon.</p>
          </div>
        )}

        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group rounded-3xl border border-gray-150 bg-white/90 p-5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <Link href={`/blog/${post.slug}`}>
                <a className="flex items-start gap-4 sm:gap-6">
                  {post.cover && (
                    <img
                      src={post.cover}
                      alt={post.title}
                      className="h-24 w-24 flex-shrink-0 rounded-2xl border border-gray-150 object-cover shadow-sm sm:h-28 sm:w-28"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900 transition-colors group-hover:text-brand-600">
                      {post.title}
                    </h2>
                    {post.description && <p className="text-gray-600 line-clamp-2">{post.description}</p>}
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-600">
                      Read more
                      <span aria-hidden className="text-lg">→</span>
                    </span>
                  </div>
                </a>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
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

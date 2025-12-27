import { useRouter } from 'next/router';
import Head from 'next/head';
import { getPublishedPosts, getPostBySlug } from '../../lib/notionClient';

const textFromRichText = (richText = []) => richText.map((item) => item.plain_text).join('');

const renderChildren = (blocks = []) => {
  if (!blocks.length) return null;
  return <div className="space-y-3">{blocks.map(renderBlock)}</div>;
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];
  const text = value?.rich_text ? textFromRichText(value.rich_text) : '';

  switch (type) {
    case 'heading_1':
      return (
        <h1 key={id} className="text-3xl font-bold mt-8">
          {text}
        </h1>
      );
    case 'heading_2':
      return (
        <h2 key={id} className="text-2xl font-semibold mt-6">
          {text}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 key={id} className="text-xl font-semibold mt-4">
          {text}
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <ul key={id} className="list-disc list-inside">
          <li>
            <span>{text}</span>
            {renderChildren(block.children)}
          </li>
        </ul>
      );
    case 'numbered_list_item':
      return (
        <ol key={id} className="list-decimal list-inside">
          <li>
            <span>{text}</span>
            {renderChildren(block.children)}
          </li>
        </ol>
      );
    case 'quote':
      return (
        <blockquote key={id} className="border-l-4 border-brand-500 pl-4 italic text-gray-700">
          {text}
        </blockquote>
      );
    case 'code':
      return (
        <pre
          key={id}
          className="blog-code-block overflow-x-auto rounded-2xl border border-gray-800/60 bg-slate-950 text-gray-100"
        >
          <code className="block whitespace-pre p-4 text-sm leading-relaxed">{text}</code>
        </pre>
      );
    case 'image': {
      const src = value?.file?.url || value?.external?.url;
      if (!src) return null;
      const caption = textFromRichText(value.caption || []);
      return (
        <figure key={id} className="my-6 text-center">
          <img
            src={src}
            alt={caption || 'Blog image'}
            className="blog-image mx-auto rounded-2xl border border-gray-150 object-cover"
            loading="lazy"
          />
          {caption && <figcaption className="mt-3 text-sm text-gray-500">{caption}</figcaption>}
        </figure>
      );
    }
    case 'divider':
      return <hr key={id} className="my-6" />;
    case 'paragraph':
    default:
      return (
        <p key={id} className="leading-7 text-gray-800">
          {text || '\u00a0'}
          {renderChildren(block.children)}
        </p>
      );
  }
};

const BlogPost = ({ post, blocks }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-3xl border border-gray-150 bg-white/90 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Preparing your article...</h1>
            <p className="mt-2 text-gray-600">Hang tight while we load the freshest version.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <Head>
          <title>{post.title} | RemitBuddy Blog</title>
          {post.description && <meta name="description" content={post.description} />}
          {post.cover && <meta property="og:image" content={post.cover} />}
        </Head>
        <article className="blog-article rounded-3xl border border-gray-150 bg-white/90 p-6 shadow-sm sm:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">RemitBuddy Blog</p>
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">{post.title}</h1>
              {post.description && <p className="text-lg text-gray-600">{post.description}</p>}
            </div>
            {post.cover && (
              <img
                src={post.cover}
                alt={post.title}
                className="blog-image mx-auto rounded-3xl border border-gray-150 object-cover shadow-sm"
                loading="lazy"
              />
            )}
            <div className="blog-content space-y-6 text-gray-900">{blocks.map(renderBlock)}</div>
          </div>
        </article>
      </div>
    </main>
  );
};

export const getStaticPaths = async () => {
  try {
    const posts = await getPublishedPosts();
    const paths = posts.map((post) => ({ params: { slug: post.slug } }));
    return { paths, fallback: true };
  } catch (error) {
    console.error('Failed to load blog paths', error);
    return { paths: [], fallback: true };
  }
};

export const getStaticProps = async ({ params }) => {
  try {
    const data = await getPostBySlug(params.slug);
    if (!data) {
      return { notFound: true };
    }

    return {
      props: { ...data },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Failed to load blog post', error);
    return {
      notFound: true,
    };
  }
};

export default BlogPost;

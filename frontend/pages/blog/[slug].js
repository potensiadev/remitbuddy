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
        <pre key={id} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>
            {text}
          </code>
        </pre>
      );
    case 'image': {
      const src = value?.file?.url || value?.external?.url;
      if (!src) return null;
      const caption = textFromRichText(value.caption || []);
      return (
        <figure key={id} className="my-4">
          <img src={src} alt={caption || 'Blog image'} className="rounded-lg w-full" loading="lazy" />
          {caption && <figcaption className="text-sm text-gray-500 mt-2">{caption}</figcaption>}
        </figure>
      );
    }
    case 'divider':
      return <hr key={id} className="my-6" />;
    case 'paragraph':
    default:
      return (
        <p key={id} className="text-gray-800 leading-7">
          {text || '\u00a0'}
          {renderChildren(block.children)}
        </p>
      );
  }
};

const BlogPost = ({ post, blocks }) => {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Head>
        <title>{post.title} | RemitBuddy Blog</title>
        {post.description && <meta name="description" content={post.description} />}
        {post.cover && <meta property="og:image" content={post.cover} />}
      </Head>
      <article className="prose lg:prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.description && <p className="text-gray-600 mb-6">{post.description}</p>}
        {post.cover && (
          <img src={post.cover} alt={post.title} className="rounded-xl mb-8 w-full object-cover" loading="lazy" />
        )}
        <div className="space-y-4">{blocks.map(renderBlock)}</div>
      </article>
    </div>
  );
};

export const getStaticPaths = async () => {
  try {
    const posts = await getPublishedPosts();
    const paths = posts.map((post) => ({ params: { slug: post.slug } }));
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Failed to load blog paths', error);
    return { paths: [], fallback: 'blocking' };
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

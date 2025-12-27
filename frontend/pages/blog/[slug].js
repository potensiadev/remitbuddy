import { useRouter } from 'next/router';
import Head from 'next/head';
import { getPublishedPosts, getPostBySlug } from '../../lib/notionClient';

const textFromRichText = (richText = []) => richText.map((item) => item.plain_text).join('');

const renderRichText = (richText = []) =>
  richText.map((item, index) => {
    const { annotations = {}, plain_text: plainText, href } = item;

    const colorClassMap = {
      gray: 'text-gray-600',
      brown: 'text-amber-800',
      orange: 'text-orange-600',
      yellow: 'text-yellow-600',
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      pink: 'text-pink-600',
      red: 'text-red-600',
    };

    const backgroundClassMap = {
      gray_background: 'bg-gray-100',
      brown_background: 'bg-amber-100',
      orange_background: 'bg-orange-100',
      yellow_background: 'bg-yellow-100',
      green_background: 'bg-green-100',
      blue_background: 'bg-blue-100',
      purple_background: 'bg-purple-100',
      pink_background: 'bg-pink-100',
      red_background: 'bg-red-100',
    };

    const classNames = [
      annotations.bold ? 'font-semibold' : null,
      annotations.italic ? 'italic' : null,
      annotations.underline ? 'underline' : null,
      annotations.strikethrough ? 'line-through' : null,
      annotations.code ? 'font-mono bg-gray-100 px-1 py-0.5 rounded' : null,
      annotations.color && colorClassMap[annotations.color] ? colorClassMap[annotations.color] : null,
      annotations.color && backgroundClassMap[annotations.color] ? `${backgroundClassMap[annotations.color]} px-1 py-0.5 rounded` : null,
    ]
      .filter(Boolean)
      .join(' ');

    const content = <span className={classNames}>{plainText}</span>;

    if (href) {
      return (
        <a key={`${plainText}-${index}`} href={href} className="text-brand-600 underline hover:text-brand-700">
          {content}
        </a>
      );
    }

    return (
      <span key={`${plainText}-${index}`} className={classNames}>
        {plainText}
      </span>
    );
  });

const renderChildren = (blocks = []) => {
  if (!blocks.length) return null;
  return <div className="space-y-4">{blocks.map(renderBlock)}</div>;
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];
  const text = value?.rich_text ? textFromRichText(value.rich_text) : '';

  switch (type) {
    case 'heading_1':
      return (
        <div key={id} className="space-y-3">
          <h1 className="text-3xl font-bold mt-8">{text}</h1>
          {renderChildren(block.children)}
        </div>
      );
    case 'heading_2':
      return (
        <div key={id} className="space-y-3">
          <h2 className="text-2xl font-semibold mt-6">{text}</h2>
          {renderChildren(block.children)}
        </div>
      );
    case 'heading_3':
      return (
        <div key={id} className="space-y-3">
          <h3 className="text-xl font-semibold mt-4">{text}</h3>
          {renderChildren(block.children)}
        </div>
      );
    case 'list': {
      const ListTag = block.listType === 'numbered' ? 'ol' : 'ul';
      return (
        <ListTag
          key={id}
          className={`pl-6 ${block.listType === 'numbered' ? 'list-decimal' : 'list-disc'} space-y-2 marker:text-gray-700`}
        >
          {block.items.map((item) => (
            <li key={item.id} className="leading-7 text-gray-800">
              <div>{renderRichText(item[item.type]?.rich_text || [])}</div>
              {item.children?.length ? <div className="mt-2 space-y-2">{item.children.map(renderBlock)}</div> : null}
            </li>
          ))}
        </ListTag>
      );
    }
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return null;
    case 'toggle':
      return (
        <details key={id} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <summary className="cursor-pointer font-semibold text-gray-900">{renderRichText(value.rich_text)}</summary>
          <div className="mt-3 space-y-3 text-gray-800">{renderChildren(block.children)}</div>
        </details>
      );
    case 'callout': {
      const icon = value.icon?.emoji || '💡';
      return (
        <div key={id} className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <span className="text-xl" aria-hidden>
            {icon}
          </span>
          <div className="space-y-2">
            <div className="text-gray-900">{renderRichText(value.rich_text)}</div>
            {renderChildren(block.children)}
          </div>
        </div>
      );
    }
    case 'table': {
      const rows = block.children || [];
      const hasColumnHeader = value?.has_column_header;
      const headerRow = hasColumnHeader ? rows[0] : null;
      const bodyRows = hasColumnHeader ? rows.slice(1) : rows;

      const renderRow = (row, isHeader) => (
        <tr key={row.id}>
          {(row.table_row?.cells || []).map((cell, cellIndex) => {
            const CellTag = isHeader && !value.has_row_header ? 'th' : 'td';
            return (
              <CellTag key={`${row.id}-${cellIndex}`} className="border border-gray-200 px-3 py-2 align-top text-gray-800">
                {cell.length ? renderRichText(cell) : '\u00a0'}
              </CellTag>
            );
          })}
        </tr>
      );

      return (
        <div key={id} className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {headerRow ? (
              <thead className="bg-gray-100 text-gray-900">
                {renderRow(headerRow, true)}
              </thead>
            ) : null}
            <tbody className="divide-y divide-gray-100">
              {bodyRows.map((row) => renderRow(row, false))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'equation':
      return (
        <div key={id} className="rounded-lg bg-gray-900 px-4 py-3 font-mono text-gray-50">
          {value?.expression}
        </div>
      );
    case 'embed': {
      const url = value?.url;
      if (!url) return null;
      return (
        <div key={id} className="overflow-hidden rounded-xl border border-gray-200">
          <iframe src={url} title={text || 'Embed'} className="h-80 w-full" allowFullScreen />
        </div>
      );
    }
    case 'synced_block':
      return (
        <div key={id} className="space-y-3 rounded-lg border border-dashed border-gray-200 px-4 py-3">
          {renderChildren(block.children)}
        </div>
      );
    case 'quote':
      return (
        <div key={id} className="space-y-3">
          <blockquote className="border-l-4 border-brand-500 pl-4 italic text-gray-700">
            {renderRichText(value.rich_text)}
          </blockquote>
          {renderChildren(block.children)}
        </div>
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.remitbuddy.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const LOCALE_MAP = {
  en: 'en_US',
  ko: 'ko_KR',
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

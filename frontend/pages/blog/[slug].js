import Head from 'next/head';
import { useRouter } from 'next/router';
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
          <blockquote className="border-l-4 border-brand-500 pl-4 italic text-gray-700">{renderRichText(value.rich_text)}</blockquote>
          {renderChildren(block.children)}
        </div>
      );
    case 'code':
      return (
        <div key={id} className="space-y-3">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{text}</code>
          </pre>
          {renderChildren(block.children)}
        </div>
      );
    case 'image': {
      const src = value?.file?.url || value?.external?.url;
      if (!src) return null;
      const caption = textFromRichText(value.caption || []);
      return (
        <figure key={id} className="my-4 space-y-2">
          <img src={src} alt={caption || 'Blog image'} className="w-full rounded-lg object-cover" loading="lazy" />
          {caption && <figcaption className="text-sm text-gray-500">{caption}</figcaption>}
          {renderChildren(block.children)}
        </figure>
      );
    }
    case 'divider':
      return <hr key={id} className="my-6" />;
    case 'paragraph':
    default:
      return (
        <div key={id} className="space-y-3">
          <p className="text-gray-800 leading-7">{text ? renderRichText(value.rich_text) : '\u00a0'}</p>
          {renderChildren(block.children)}
        </div>
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

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Post not found.</p>
      </div>
    );
  }

  const pageTitle = post.title ? `${post.title} | RemitBuddy Blog` : 'RemitBuddy Blog';
  const metaTitle = post.title || 'RemitBuddy Blog';
  const metaDescription = post.description || 'Read the latest insights from RemitBuddy.';
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogLocale = LOCALE_MAP[router.locale] || LOCALE_MAP[router.defaultLocale] || 'en_US';
  const ogImage = post.cover || DEFAULT_OG_IMAGE;

  return (
    <div className="container mx-auto px-4 py-12">
      <Head>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={metaDescription} />

        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <article className="prose lg:prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.description && <p className="text-gray-600 mb-6">{post.description}</p>}
        {post.cover && (
          <img src={post.cover} alt={post.title} className="rounded-xl mb-8 w-full object-cover" loading="lazy" />
        )}
        <div className="space-y-4">{normalizedBlocks.map(renderBlock)}</div>
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

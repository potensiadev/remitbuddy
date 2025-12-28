import React from 'react';
import '../../styles/blog.css';
import { getPostBySlug, getPublishedPosts } from '../../lib/notion';

/* =========================
   Utils
========================= */

const getPlainText = (richText) => {
  if (!Array.isArray(richText)) return '';
  return richText.map((item) => item?.plain_text || '').join('');
};

const renderRichText = (richTextArray) => {
  if (!Array.isArray(richTextArray)) return null;

  return richTextArray.map((segment, index) => {
    const text = segment?.plain_text || '';
    const annotations = segment?.annotations || {};
    let node = text;

    if (annotations.code) node = <code>{node}</code>;
    if (annotations.bold) node = <strong>{node}</strong>;
    if (annotations.italic) node = <em>{node}</em>;
    if (annotations.underline) node = <u>{node}</u>;
    if (annotations.strikethrough) node = <s>{node}</s>;

    const href = segment?.href;
    if (typeof href === 'string' && href) {
      const isInternal =
        href.startsWith('/') ||
        href.startsWith('https://www.remitbuddy.com');

      node = isInternal ? (
        <a href={href}>{node}</a>
      ) : (
        <a href={href} target="_blank" rel="noreferrer noopener">
          {node}
        </a>
      );
    }

    return (
      <React.Fragment key={`${text}-${index}`}>
        {node}
      </React.Fragment>
    );
  });
};

/* =========================
   Page Component
========================= */

const BlogPost = ({ post }) => {
  if (!post) return null;

  const blocks = Array.isArray(post.blocks) ? post.blocks : [];
  const content = [];

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'blog_cta_click', {
        slug: post.slug || '',
        published_at: post.publishedAt || '',
        featured: 'false',
        variant: 'B',
      });
    }
  };

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const type = block?.type;

    /* Paragraph */
    if (type === 'paragraph') {
      content.push(
        <p key={block.id || `p-${i}`}>
          {renderRichText(block.paragraph?.rich_text)}
        </p>
      );
      continue;
    }

    /* Headings */
    if (type === 'heading_1') {
      content.push(
        <h1 key={block.id || `h1-${i}`}>
          {renderRichText(block.heading_1?.rich_text)}
        </h1>
      );
      continue;
    }

    if (type === 'heading_2') {
      content.push(
        <h2 key={block.id || `h2-${i}`}>
          {renderRichText(block.heading_2?.rich_text)}
        </h2>
      );
      continue;
    }

    if (type === 'heading_3') {
      content.push(
        <h3 key={block.id || `h3-${i}`}>
          {renderRichText(block.heading_3?.rich_text)}
        </h3>
      );
      continue;
    }

    /* Lists */
    if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      const ListTag = type === 'bulleted_list_item' ? 'ul' : 'ol';
      const items = [];
      let j = i;

      while (j < blocks.length && blocks[j]?.type === type) {
        items.push(
          <li key={blocks[j].id || `li-${j}`}>
            {renderRichText(blocks[j][type]?.rich_text)}
          </li>
        );
        j += 1;
      }

      content.push(
        <ListTag key={block.id || `list-${i}`}>
          {items}
        </ListTag>
      );

      i = j - 1;
      continue;
    }

    /* Quote */
    if (type === 'quote') {
      content.push(
        <blockquote key={block.id || `quote-${i}`}>
          {renderRichText(block.quote?.rich_text)}
        </blockquote>
      );
      continue;
    }

    /* Divider */
    if (type === 'divider') {
      content.push(<hr key={block.id || `hr-${i}`} />);
      continue;
    }

    /* Callout */
    if (type === 'callout') {
      content.push(
        <div key={block.id || `callout-${i}`}>
          {renderRichText(block.callout?.rich_text)}
        </div>
      );
      continue;
    }

    /* Code block */
    if (type === 'code') {
      content.push(
        <pre key={block.id || `code-${i}`}>
          <code>{getPlainText(block.code?.rich_text)}</code>
        </pre>
      );
      continue;
    }

    /* Toggle (title only) */
    if (type === 'toggle') {
      const text = getPlainText(block.toggle?.rich_text);
      if (text) {
        content.push(<h3 key={block.id || `toggle-${i}`}>{text}</h3>);
      }
      continue;
    }

    /* Bookmark */
    if (type === 'bookmark') {
      const url = block.bookmark?.url;
      if (!url) continue;

      const label = getPlainText(block.bookmark?.caption) || url;
      content.push(
        <a
          key={block.id || `bookmark-${i}`}
          href={url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {label}
        </a>
      );
      continue;
    }

    /* Image */
    if (type === 'image') {
      const url =
        block.image?.external?.url || block.image?.file?.url;

      if (!url) continue;

      content.push(
        <img
          key={block.id || `image-${i}`}
          src={url}
          alt={getPlainText(block.image?.caption)}
          loading="lazy"
          decoding="async"
        />
      );
      continue;
    }

    /* File */
    if (type === 'file') {
      const url =
        block.file?.external?.url || block.file?.file?.url;

      if (!url) continue;

      const label =
        getPlainText(block.file?.caption) ||
        block.file?.name ||
        'Download file';

      content.push(
        <a
          key={block.id || `file-${i}`}
          href={url}
          download
          target="_blank"
          rel="noreferrer noopener"
        >
          {label}
        </a>
      );
      continue;
    }

    /* Embed */
    if (type === 'embed') {
      const url = block.embed?.url;
      if (!url) continue;

      const label = getPlainText(block.embed?.caption) || url;
      content.push(
        <a
          key={block.id || `embed-${i}`}
          href={url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {label}
        </a>
      );
    }
  }

  return (
    <div className="blog-content">
      <h1>{post.title}</h1>
      {post.excerpt && <p>{post.excerpt}</p>}
      {content}

      {/* CTA */}
      <section>
        <p>Stop overpaying on international transfers.</p>
        <a href="/" onClick={handleCtaClick}>
          See best rates
        </a>
      </section>
    </div>
  );
};

/* =========================
   SSG
========================= */

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  const paths = (posts || [])
    .filter((post) => post?.slug)
    .map((post) => ({ params: { slug: post.slug } }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const slug = params?.slug;

  if (!slug) {
    return { notFound: true, revalidate: 60 };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: { post },
    revalidate: 60,
  };
}

export default BlogPost;
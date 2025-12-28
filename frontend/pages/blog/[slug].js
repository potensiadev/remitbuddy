import React from 'react';
import { getPostBySlug, getPublishedPosts } from '../../lib/notion';

const getPlainText = (richText) => {
  if (!Array.isArray(richText)) {
    return '';
  }

  return richText.map((item) => item?.plain_text || '').join('');
};

const renderRichText = (richTextArray) => {
  if (!Array.isArray(richTextArray)) {
    return null;
  }

  return richTextArray.map((segment, index) => {
    const text = segment?.plain_text || '';
    const annotations = segment?.annotations || {};
    let node = text;

    if (annotations.code) {
      node = <code>{node}</code>;
    }
    if (annotations.bold) {
      node = <strong>{node}</strong>;
    }
    if (annotations.italic) {
      node = <em>{node}</em>;
    }
    if (annotations.underline) {
      node = <u>{node}</u>;
    }
    if (annotations.strikethrough) {
      node = <s>{node}</s>;
    }

    const href = segment?.href;
    if (typeof href === 'string' && href) {
      const isInternal =
        href.startsWith('/') ||
        href.startsWith('https://www.remitbuddy.com');

      if (isInternal) {
        node = <a href={href}>{node}</a>;
      } else {
        node = (
          <a href={href} target="_blank" rel="noreferrer noopener">
            {node}
          </a>
        );
      }
    }

    return <React.Fragment key={segment?.plain_text ? `${segment.plain_text}-${index}` : index}>{node}</React.Fragment>;
  });
};

const BlogPost = ({ post }) => {
  if (!post) {
    return null;
  }

  const blocks = Array.isArray(post.blocks) ? post.blocks : [];
  const content = [];
  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'blog_cta_click', {
        slug: `${post?.slug || ''}`,
        published_at: `${post?.publishedAt || ''}`,
      featured: 'false',
      variant: 'B',
      });
    }
  };

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const type = block?.type;

    if (type === 'paragraph') {
      const text = renderRichText(block?.paragraph?.rich_text);
      content.push(<p key={block.id || `p-${i}`}>{text}</p>);
      continue;
    }

    if (type === 'heading_1') {
      const text = renderRichText(block?.heading_1?.rich_text);
      content.push(<h1 key={block.id || `h1-${i}`}>{text}</h1>);
      continue;
    }

    if (type === 'heading_2') {
      const text = renderRichText(block?.heading_2?.rich_text);
      content.push(<h2 key={block.id || `h2-${i}`}>{text}</h2>);
      continue;
    }

    if (type === 'heading_3') {
      const text = renderRichText(block?.heading_3?.rich_text);
      content.push(<h3 key={block.id || `h3-${i}`}>{text}</h3>);
      continue;
    }

    if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      const listType = type === 'bulleted_list_item' ? 'ul' : 'ol';
      const items = [];
      let j = i;

      while (j < blocks.length) {
        const listBlock = blocks[j];
        const listBlockType = listBlock?.type;

        if (listBlockType !== type) {
          break;
        }

        const text = renderRichText(listBlock?.[type]?.rich_text);
        items.push(<li key={listBlock.id || `li-${j}`}>{text}</li>);
        j += 1;
      }

      if (listType === 'ul') {
        content.push(<ul key={block.id || `ul-${i}`}>{items}</ul>);
      } else {
        content.push(<ol key={block.id || `ol-${i}`}>{items}</ol>);
      }

      i = j - 1;
    }

    if (type === 'quote') {
      const text = renderRichText(block?.quote?.rich_text);
      content.push(<blockquote key={block.id || `quote-${i}`}>{text}</blockquote>);
      continue;
    }

    if (type === 'divider') {
      content.push(<hr key={block.id || `hr-${i}`} />);
      continue;
    }

    if (type === 'callout') {
      const text = renderRichText(block?.callout?.rich_text);
      content.push(<div key={block.id || `callout-${i}`}>{text}</div>);
      continue;
    }

    if (type === 'code') {
      const text = getPlainText(block?.code?.rich_text);
      content.push(
        <pre key={block.id || `code-${i}`}>
          <code>{text}</code>
        </pre>
      );
      continue;
    }

    if (type === 'toggle') {
      const text = getPlainText(block?.toggle?.rich_text);
      if (!text) {
        continue;
      }
      content.push(<h3 key={block.id || `toggle-${i}`}>{text}</h3>);
      continue;
    }

    if (type === 'bookmark') {
      const url = block?.bookmark?.url;
      if (typeof url !== 'string' || !url) {
        continue;
      }

      const title = getPlainText(block?.bookmark?.caption) || url;
      const isInternal =
        url.startsWith('/') || url.startsWith('https://www.remitbuddy.com');

      if (isInternal) {
        content.push(
          <a key={block.id || `bookmark-${i}`} href={url}>
            {title}
          </a>
        );
      } else {
        content.push(
          <a
            key={block.id || `bookmark-${i}`}
            href={url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {title}
          </a>
        );
      }
      continue;
    }

    if (type === 'image') {
      const externalUrl = block?.image?.external?.url;
      const fileUrl = block?.image?.file?.url;
      const url = typeof externalUrl === 'string' && externalUrl
        ? externalUrl
        : typeof fileUrl === 'string' && fileUrl
          ? fileUrl
          : '';

      if (!url) {
        continue;
      }

      const altText = getPlainText(block?.image?.caption) || '';
      content.push(
        <img
          key={block.id || `image-${i}`}
          src={url}
          alt={altText}
          loading="lazy"
          decoding="async"
        />
      );
      continue;
    }

    if (type === 'file') {
      const externalUrl = block?.file?.external?.url;
      const fileUrl = block?.file?.file?.url;
      const url = typeof externalUrl === 'string' && externalUrl
        ? externalUrl
        : typeof fileUrl === 'string' && fileUrl
          ? fileUrl
          : '';

      if (!url) {
        continue;
      }

      let label = getPlainText(block?.file?.caption);
      if (!label) {
        label = typeof block?.file?.name === 'string' ? block.file.name : '';
      }
      if (!label) {
        const urlParts = url.split('/');
        label = urlParts[urlParts.length - 1] || 'Download file';
      }

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

    if (type === 'embed') {
      const url = block?.embed?.url;
      if (typeof url !== 'string' || !url) {
        continue;
      }

      const label = getPlainText(block?.embed?.caption) || url;
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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p>{post.excerpt || 'This is a placeholder blog post.'}</p>
      {content}
      <section>
        <p>Stop overpaying on international transfers.</p>
        <a href="/" onClick={handleCtaClick}>
          See best rates
        </a>
      </section>
    </div>
  );
};

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  const paths = (posts || [])
    .filter((post) => post?.slug)
    .map((post) => ({
      params: { slug: post.slug },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const slug = params?.slug;

  if (typeof slug !== 'string' || !slug) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}

export default BlogPost;

import { getPublishedPosts } from '../lib/notion';

const SITE_URL = 'https://www.remitbuddy.com';

const buildUrlEntry = (loc, lastmod) => {
  if (lastmod) {
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  }
  return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
};

const buildSitemapXml = (urls) => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');
};

export async function getStaticProps({ res }) {
  let posts = [];
  try {
    posts = await getPublishedPosts();
  } catch (error) {
    console.error('Failed to fetch posts for sitemap.', error);
    posts = [];
  }

  const today = new Date().toISOString().split('T')[0];
  const urls = [
    buildUrlEntry(`${SITE_URL}/`),
    buildUrlEntry(`${SITE_URL}/blog`),
  ];

  (posts || []).forEach((post) => {
    const slug = post?.slug;
    if (typeof slug !== 'string' || !slug) {
      return;
    }

    const lastmod = post?.publishedAt
      ? new Date(post.publishedAt).toISOString().split('T')[0]
      : today;

    urls.push(buildUrlEntry(`${SITE_URL}/blog/${slug}`, lastmod));
  });

  const sitemap = buildSitemapXml(urls);
  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
    revalidate: 3600,
  };
}

export default function Sitemap() {
  return null;
}

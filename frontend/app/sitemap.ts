import type { MetadataRoute } from 'next';

import { getPublishedPosts } from '../lib/notion';

const SITE_URL = 'https://www.remitbuddy.com';
const LOCALES = [
  'en',
  'ko',
  'vi',
  'tl',
  'km',
  'my',
  'th',
  'uz',
  'id',
  'si',
  'ne',
  'bn',
  'mn',
  'cn',
];

const buildStaticUrls = (): MetadataRoute.Sitemap => {
  const lastModified = new Date();

  const localeUrls = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
  }));

  return [
    ...localeUrls,
    { url: `${SITE_URL}/blog`, lastModified },
  ];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = buildStaticUrls();

  if (process.env.VERCEL === '1') {
    return staticUrls;
  }

  try {
    const posts = await getPublishedPosts();
    const lastModified = new Date();

    const postUrls = (posts || [])
      .map((post: { slug?: string }) => post?.slug)
      .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
      .map((slug) => ({
        url: `${SITE_URL}/blog/${slug}`,
        lastModified,
      }));

    return [...staticUrls, ...postUrls];
  } catch (error) {
    console.error('Failed to fetch posts for sitemap.', error);
    return staticUrls;
  }
}

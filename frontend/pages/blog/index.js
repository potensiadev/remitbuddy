import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getPublishedPosts } from '../../lib/notion';

const BlogIndex = ({ posts }) => {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('blog.title')}</h1>
      <ul className="list-disc pl-5">
        {(posts || []).map((post) => (
          <li key={post.slug || post.title}>
            <Link href={`/blog/${post.slug}`}>{post.title || post.slug}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  const posts = await getPublishedPosts();

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      posts,
    },
    revalidate: 60,
  };
}

export default BlogIndex;


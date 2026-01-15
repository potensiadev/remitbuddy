import React from 'react';
import Link from 'next/link';
import { getPublishedPosts } from '../../lib/notion';

const BlogIndex = ({ posts }) => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-4xl font-bold mb-4">RemitBuddy Blog</h1>
    <ul className="list-disc pl-5">
      {(posts || []).map((post) => (
        <li key={post.slug || post.title}>
          <Link href={`/blog/${post.slug}`}>{post.title || post.slug}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export async function getStaticProps() {
  const posts = await getPublishedPosts();

  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
}

export default BlogIndex;

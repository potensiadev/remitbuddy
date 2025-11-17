import React from 'react';
import Link from 'next/link';

const BlogIndex = () => {
  // Placeholder data - this will eventually come from a CMS
  const posts = [
    { slug: 'first-post', title: 'My First Blog Post' },
    { slug: 'second-post', title: 'Another Interesting Article' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Blog</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`}>
              <a className="text-2xl font-semibold text-brand-500 hover:text-brand-600">{post.title}</a>
            </Link>
            <p className="text-gray-600 mt-2">A brief summary of the blog post will go here...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogIndex;

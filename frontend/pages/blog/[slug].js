import React from 'react';
import { useRouter } from 'next/router';

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Blog Post: {slug}</h1>
      <p>This is a placeholder for the blog post with slug: {slug}.</p>
      <p>Content will be added here later from a headless CMS.</p>
    </div>
  );
};

export default BlogPost;

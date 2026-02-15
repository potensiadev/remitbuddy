import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getPostBySlug, getPublishedPosts } from '../../lib/notion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

const BlogPost = ({ post }) => {
    const { t, i18n } = useTranslation('common');

    // Helper formatting functions
    const text = (richText) => {
        if (!Array.isArray(richText)) return '';
        return richText.map(t => {
            // Basic styling
            let content = t.plain_text;
            if (t.annotations.bold) content = <strong>{content}</strong>;
            if (t.annotations.italic) content = <em>{content}</em>;
            if (t.annotations.underline) content = <u>{content}</u>;
            if (t.annotations.strikethrough) content = <s>{content}</s>;
            if (t.annotations.code) content = <code className="bg-gray-100 text-red-500 px-1 rounded text-sm">{content}</code>;
            // Handle links
            if (t.href) content = <a href={t.href} className="text-blue-600 hover:underline">{content}</a>;

            return <span key={Math.random()}>{content}</span>;
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (i18n.language === 'ko') {
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else {
            // English format: 1 Feb 2026
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    // Block Renderer
    const renderBlock = (block) => {
        const { type, id } = block;
        const value = block[type];

        switch (type) {
            case 'paragraph':
                return <p className="mb-4 text-gray-700 leading-relaxed text-lg">{text(value.rich_text)}</p>;

            case 'heading_1':
                return <h1 className="text-3xl font-bold mt-10 mb-6 text-gray-900 leading-tight">{text(value.rich_text)}</h1>;

            case 'heading_2':
                return <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 leading-tight border-b pb-2">{text(value.rich_text)}</h2>;

            case 'heading_3':
                return <h3 className="text-xl font-bold mt-8 mb-3 text-gray-900 leading-tight">{text(value.rich_text)}</h3>;

            case 'bulleted_list_item':
                return (
                    <li className="mb-2 text-gray-700 leading-relaxed list-disc ml-5">
                        {text(value.rich_text)}
                    </li>
                );

            case 'numbered_list_item':
                return (
                    <li className="mb-2 text-gray-700 leading-relaxed list-decimal ml-5">
                        {text(value.rich_text)}
                    </li>
                );

            case 'quote':
                return (
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50/50 italic text-gray-700 rounded-r-lg">
                        {text(value.rich_text)}
                    </blockquote>
                );

            case 'callout':
                return (
                    <div className="flex gap-4 p-4 my-6 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="text-2xl">{value.icon?.emoji}</div>
                        <div className="text-gray-700">{text(value.rich_text)}</div>
                    </div>
                );

            case 'image':
                let url = '';
                if (value.type === 'external') {
                    url = value.external.url;
                } else if (value.type === 'file') {
                    // Use proxy with blockId for inline images
                    url = `/api/image?blockId=${id}`;
                }

                const caption = value.caption ? text(value.caption) : '';
                return (
                    <figure className="my-8">
                        <img src={url} alt={caption} className="w-full rounded-2xl shadow-sm border border-gray-100" loading="lazy" />
                        {caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
                    </figure>
                );

            case 'divider':
                return <hr className="my-10 border-gray-200" />;

            default:
                return null; // Unsupported blocks
        }
    };

    if (!post) return null;

    return (
        <>
            <Head>
                <title>{post.title} | RemitBuddy Blog</title>
                <meta name="description" content={post.excerpt} />
                {post.cover && <meta property="og:image" content={post.cover} />}
            </Head>

            <div className="min-h-screen bg-white safe-top safe-bottom">
                <Navigation />

                <article className="pt-24 sm:pt-32 pb-16 lg:pb-24">
                    <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">

                        {/* Post Header */}
                        <header className="mb-10 text-center">
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex justify-center gap-2 mb-6">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            {post.publishedAt && (
                                <time className="text-gray-500 font-medium">
                                    {formatDate(post.publishedAt)}
                                </time>
                            )}
                        </header>

                        {/* Cover Image */}
                        {post.cover && (
                            <div className="mb-12 rounded-3xl overflow-hidden shadow-lg border border-gray-100 aspect-video">
                                <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Post Content */}
                        <div className="prose prose-lg prose-blue max-w-none text-gray-700">
                            {/* Render blocks, grouping lists if needed (simplified here for individual mapping) */}
                            {post.blocks.map((block) => (
                                <React.Fragment key={block.id}>
                                    {renderBlock(block)}
                                </React.Fragment>
                            ))}
                        </div>

                    </div>
                </article>

                {/* Removed the manual CTA section requested to be removed */}
                <Footer />
            </div>
        </>
    );
};

export async function getStaticPaths() {
    // Fetch posts from all locales to pre-generate all slug paths
    const [koPosts, enPosts] = await Promise.all([
        getPublishedPosts('ko'),
        getPublishedPosts('en'),
    ]);

    // Deduplicate slugs across both DBs
    const allSlugs = [...new Set([...koPosts, ...enPosts].map((p) => p.slug))];

    const paths = allSlugs.map((slug) => ({
        params: { slug },
    }));

    return {
        paths,
        fallback: 'blocking',
    };
}

export async function getStaticProps({ params, locale }) {
    const post = await getPostBySlug(params.slug, locale);

    if (!post) {
        return {
            notFound: true,
            revalidate: 60, // Re-check Notion after 60s (new posts will appear)
        };
    }

    return {
        props: {
            post,
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 60, // ISR: Revalidate every 60 seconds
    };
}

export default BlogPost;

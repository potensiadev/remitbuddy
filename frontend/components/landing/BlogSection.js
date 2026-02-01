import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const BlogSection = ({ posts }) => {
    const { t, i18n } = useTranslation('common');

    // Helper date formatter
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

    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4 border border-blue-100">
                        {t('blog.badge', 'Blog')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        {t('blog.hero_title', 'Smart Transfer Tips')}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t('blog.hero_desc', 'Get the latest insights on exchange rates, fees, and the smartest ways to send money abroad.')}
                    </p>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.slice(0, 3).map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                            {/* Image Container */}
                            <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {post.cover ? (
                                    <img
                                        src={post.cover}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                        <svg className="w-12 h-12 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Date Badge */}
                                {post.publishedAt && (
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                                        {formatDate(post.publishedAt)}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col">
                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto flex items-center text-sm font-bold text-blue-600">
                                    {t('blog.read_more', '꿀팁 더 보기')}
                                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/blog" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-200">
                        {t('blog.view_all', 'View All Posts')}
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;

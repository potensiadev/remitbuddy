import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from '../../lib/notion';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { trackEvent } from '../../utils/analytics';

// UTM 파라미터를 포함한 CTA 링크 생성
const buildCtaLink = (basePath, slug, ctaType) => {
    const params = new URLSearchParams({
        utm_source: 'blog',
        utm_medium: 'cta',
        utm_campaign: slug,
        utm_content: ctaType
    });
    return `${basePath}?${params.toString()}`;
};

// CTA 클릭 추적
const trackCtaClick = (slug, ctaType, amount) => {
    trackEvent('blog_cta_click', {
        blog_slug: slug,
        cta_type: ctaType,
        amount: amount
    });
};

// Inline CTA Component (Contextual, not aggressive)
const InlineCTA = ({ type, lang, slug }) => {
    const isKo = lang === 'ko';

    const handleCtaClick = (ctaType, amount) => {
        trackCtaClick(slug, ctaType, amount);
    };

    if (type === 'compare') {
        return (
            <div className="my-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
                <div className="flex items-start gap-4">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                            {isKo ? '실시간 환율로 비교해보세요' : 'Compare with live rates'}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                            {isKo
                                ? '지금 ₩1,000,000 송금 시 얼마나 받을 수 있는지 확인하세요'
                                : 'See how much your family receives when you send ₩1,000,000'}
                        </p>
                        <Link
                            href={buildCtaLink('/', slug, 'inline_compare') + '&amount=1000000'}
                            onClick={() => handleCtaClick('inline_compare', 1000000)}
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            {isKo ? '비교 결과 보기 →' : 'View comparison →'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'calculator') {
        return (
            <div className="my-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl">
                <div className="flex items-start gap-4">
                    <span className="text-2xl">🧮</span>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                            {isKo ? '내 송금액으로 계산해보기' : 'Calculate with your amount'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={buildCtaLink('/', slug, 'inline_calc_500k') + '&amount=500000'}
                                onClick={() => handleCtaClick('inline_calc', 500000)}
                                className="px-3 py-1.5 bg-white border border-green-200 rounded-lg text-sm hover:bg-green-50"
                            >
                                ₩500,000
                            </Link>
                            <Link
                                href={buildCtaLink('/', slug, 'inline_calc_1m') + '&amount=1000000'}
                                onClick={() => handleCtaClick('inline_calc', 1000000)}
                                className="px-3 py-1.5 bg-white border border-green-200 rounded-lg text-sm hover:bg-green-50"
                            >
                                ₩1,000,000
                            </Link>
                            <Link
                                href={buildCtaLink('/', slug, 'inline_calc_2m') + '&amount=2000000'}
                                onClick={() => handleCtaClick('inline_calc', 2000000)}
                                className="px-3 py-1.5 bg-white border border-green-200 rounded-lg text-sm hover:bg-green-50"
                            >
                                ₩2,000,000
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// Related Posts Component
const RelatedPosts = ({ posts, lang }) => {
    if (!posts || posts.length === 0) return null;

    const isKo = lang === 'ko';

    return (
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📚 {isKo ? '관련 가이드' : 'Related Guides'}
            </h3>
            <div className="space-y-3">
                {posts.map(post => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                                    {post.title}
                                </h4>
                                {post.matchingTags && post.matchingTags.length > 0 && (
                                    <div className="flex gap-1 mt-2">
                                        {post.matchingTags.slice(0, 2).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="text-gray-400 group-hover:text-blue-500">→</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const BlogPost = ({ post, relatedPosts }) => {
    const { t, i18n } = useTranslation('common');

    // 색상 매핑 함수
    const getColorClass = (color) => {
        if (!color || color === 'default') return '';

        const colorMap = {
            'gray': 'text-gray-500',
            'brown': 'text-amber-700',
            'orange': 'text-orange-600',
            'yellow': 'text-yellow-600',
            'green': 'text-green-600',
            'blue': 'text-blue-600',
            'purple': 'text-purple-600',
            'pink': 'text-pink-600',
            'red': 'text-red-600',
            'gray_background': 'bg-gray-100 px-1 rounded',
            'brown_background': 'bg-amber-100 px-1 rounded',
            'orange_background': 'bg-orange-100 px-1 rounded',
            'yellow_background': 'bg-yellow-100 px-1 rounded',
            'green_background': 'bg-green-100 px-1 rounded',
            'blue_background': 'bg-blue-100 px-1 rounded',
            'purple_background': 'bg-purple-100 px-1 rounded',
            'pink_background': 'bg-pink-100 px-1 rounded',
            'red_background': 'bg-red-100 px-1 rounded',
        };
        return colorMap[color] || '';
    };

    // Rich Text 렌더링 (색상 지원 포함)
    const text = (richText) => {
        if (!Array.isArray(richText)) return '';
        return richText.map((t, idx) => {
            let content = t.plain_text;
            const { annotations } = t;

            if (annotations.bold) content = <strong key={`bold-${idx}`}>{content}</strong>;
            if (annotations.italic) content = <em key={`italic-${idx}`}>{content}</em>;
            if (annotations.underline) content = <u key={`underline-${idx}`}>{content}</u>;
            if (annotations.strikethrough) content = <s key={`strike-${idx}`}>{content}</s>;
            if (annotations.code) {
                content = <code key={`code-${idx}`} className="bg-gray-100 text-red-500 px-1.5 py-0.5 rounded text-sm font-mono">{content}</code>;
            }
            if (t.href) {
                content = <a key={`link-${idx}`} href={t.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{content}</a>;
            }

            const colorClass = getColorClass(annotations.color);
            return <span key={idx} className={colorClass}>{content}</span>;
        });
    };

    // Plain text 추출
    const getPlainText = (richText) => {
        if (!Array.isArray(richText)) return '';
        return richText.map(t => t.plain_text).join('');
    };

    // 날짜 포맷
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
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    // 연속된 리스트 아이템을 그룹화
    const groupBlocks = (blocks) => {
        if (!blocks) return [];
        const grouped = [];
        let currentList = null;

        blocks.forEach((block) => {
            if (block.type === 'bulleted_list_item') {
                if (!currentList || currentList.type !== 'bulleted_list') {
                    currentList = { type: 'bulleted_list', id: `list-${block.id}`, items: [] };
                    grouped.push(currentList);
                }
                currentList.items.push(block);
            } else if (block.type === 'numbered_list_item') {
                if (!currentList || currentList.type !== 'numbered_list') {
                    currentList = { type: 'numbered_list', id: `list-${block.id}`, items: [] };
                    grouped.push(currentList);
                }
                currentList.items.push(block);
            } else if (block.type === 'to_do') {
                if (!currentList || currentList.type !== 'to_do_list') {
                    currentList = { type: 'to_do_list', id: `list-${block.id}`, items: [] };
                    grouped.push(currentList);
                }
                currentList.items.push(block);
            } else {
                currentList = null;
                grouped.push(block);
            }
        });

        return grouped;
    };

    // Callout 색상 매핑
    const getCalloutStyle = (color) => {
        const styleMap = {
            'gray_background': 'bg-gray-50 border-gray-200',
            'brown_background': 'bg-amber-50 border-amber-200',
            'orange_background': 'bg-orange-50 border-orange-200',
            'yellow_background': 'bg-yellow-50 border-yellow-200',
            'green_background': 'bg-green-50 border-green-200',
            'blue_background': 'bg-blue-50 border-blue-200',
            'purple_background': 'bg-purple-50 border-purple-200',
            'pink_background': 'bg-pink-50 border-pink-200',
            'red_background': 'bg-red-50 border-red-200',
        };
        return styleMap[color] || 'bg-gray-50 border-gray-200';
    };

    // 블록 렌더러
    const renderBlock = (block) => {
        const { type, id } = block;
        const value = block[type];

        switch (type) {
            case 'paragraph':
                if (!value.rich_text || value.rich_text.length === 0) {
                    return <div className="h-4" />;
                }
                return <p className="mb-4 text-gray-700 leading-relaxed text-lg">{text(value.rich_text)}</p>;

            case 'heading_1':
                return <h1 className="text-3xl font-bold mt-10 mb-6 text-gray-900 leading-tight">{text(value.rich_text)}</h1>;

            case 'heading_2':
                return <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 leading-tight border-b pb-2">{text(value.rich_text)}</h2>;

            case 'heading_3':
                return <h3 className="text-xl font-bold mt-8 mb-3 text-gray-900 leading-tight">{text(value.rich_text)}</h3>;

            case 'bulleted_list_item':
                return (
                    <li className="text-gray-700 leading-relaxed">
                        {text(value.rich_text)}
                        {block.children && block.children.length > 0 && (
                            <ul className="mt-2 ml-6 space-y-2 list-disc">
                                {groupBlocks(block.children).map(child => renderGroupedBlock(child))}
                            </ul>
                        )}
                    </li>
                );

            case 'numbered_list_item':
                return (
                    <li className="text-gray-700 leading-relaxed">
                        {text(value.rich_text)}
                        {block.children && block.children.length > 0 && (
                            <ol className="mt-2 ml-6 space-y-2 list-decimal">
                                {groupBlocks(block.children).map(child => renderGroupedBlock(child))}
                            </ol>
                        )}
                    </li>
                );

            case 'to_do':
                return (
                    <div className="flex items-start gap-3 py-1">
                        <span className="mt-0.5 text-lg flex-shrink-0">{value.checked ? '✅' : '⬜'}</span>
                        <span className={value.checked ? 'line-through text-gray-400' : 'text-gray-700'}>
                            {text(value.rich_text)}
                        </span>
                    </div>
                );

            case 'quote':
                return (
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50/50 italic text-gray-700 rounded-r-lg">
                        {text(value.rich_text)}
                    </blockquote>
                );

            case 'callout':
                // Mid-article CTA detection: Check if callout is a CTA marker
                const calloutText = getPlainText(value.rich_text).toLowerCase();
                const ctaIcon = value.icon?.emoji;

                // If callout contains CTA markers, render inline CTA instead
                if (ctaIcon === '🎯' || calloutText.includes('[cta:compare]')) {
                    return <InlineCTA type="compare" lang={i18n.language} slug={post.slug} />;
                }
                if (ctaIcon === '🧮' || calloutText.includes('[cta:calculator]')) {
                    return <InlineCTA type="calculator" lang={i18n.language} slug={post.slug} />;
                }

                return (
                    <div className={`flex gap-4 p-5 my-6 ${getCalloutStyle(value.color)} border rounded-2xl`}>
                        <div className="text-3xl flex-shrink-0">{value.icon?.emoji || '💡'}</div>
                        <div className="text-gray-700 leading-relaxed flex-1">
                            {text(value.rich_text)}
                            {block.children && block.children.length > 0 && (
                                <div className="mt-3">
                                    {groupBlocks(block.children).map(child => renderGroupedBlock(child))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'toggle':
                return (
                    <details className="my-4 group">
                        <summary className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium flex items-center gap-3 transition-colors list-none">
                            <span className="text-gray-400 group-open:rotate-90 transition-transform">▶</span>
                            {value.icon?.emoji && <span className="text-xl">{value.icon.emoji}</span>}
                            <span>{text(value.rich_text)}</span>
                        </summary>
                        <div className="pl-8 pr-4 py-3 border-l-2 border-gray-200 ml-4 mt-2">
                            {block.children && groupBlocks(block.children).map(child => renderGroupedBlock(child))}
                        </div>
                    </details>
                );

            case 'code':
                return (
                    <div className="my-6">
                        <div className="bg-gray-800 rounded-t-xl px-4 py-2 flex justify-between items-center">
                            <span className="text-gray-400 text-sm font-mono">{value.language || 'code'}</span>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-xl overflow-x-auto">
                            <code className="text-sm font-mono leading-relaxed whitespace-pre-wrap">
                                {getPlainText(value.rich_text)}
                            </code>
                        </pre>
                        {value.caption && value.caption.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2">{text(value.caption)}</p>
                        )}
                    </div>
                );

            case 'table':
                return (
                    <div className="my-6 overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200 rounded-xl overflow-hidden">
                            <tbody>
                                {block.children?.map((row, rowIdx) => (
                                    <tr key={row.id} className={rowIdx === 0 && value.has_column_header ? 'bg-gray-50 font-semibold' : ''}>
                                        {row.table_row?.cells.map((cell, cellIdx) => {
                                            const Tag = rowIdx === 0 && value.has_column_header ? 'th' : 'td';
                                            const isRowHeader = cellIdx === 0 && value.has_row_header;
                                            return (
                                                <Tag
                                                    key={cellIdx}
                                                    className={`px-4 py-3 border border-gray-200 text-left ${isRowHeader ? 'bg-gray-50 font-semibold' : ''}`}
                                                >
                                                    {text(cell)}
                                                </Tag>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'bookmark':
                return (
                    <a
                        href={value.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="my-6 block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🔗</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-blue-600 group-hover:underline truncate">{value.url}</p>
                                {value.caption && value.caption.length > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">{text(value.caption)}</p>
                                )}
                            </div>
                            <span className="text-gray-400">↗</span>
                        </div>
                    </a>
                );

            case 'link_preview':
                return (
                    <a
                        href={value.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="my-6 block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🔗</span>
                            <p className="text-blue-600 group-hover:underline truncate flex-1">{value.url}</p>
                            <span className="text-gray-400">↗</span>
                        </div>
                    </a>
                );

            case 'video':
                const videoUrl = value.type === 'external' ? value.external?.url : value.file?.url;
                if (!videoUrl) return null;

                const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

                if (isYouTube) {
                    const videoId = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/)?.[1];
                    if (videoId) {
                        return (
                            <div className="my-6 aspect-video rounded-xl overflow-hidden shadow-lg">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        );
                    }
                }
                return (
                    <div className="my-6">
                        <video src={videoUrl} controls className="w-full rounded-xl shadow-lg" />
                        {value.caption && value.caption.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2 text-center">{text(value.caption)}</p>
                        )}
                    </div>
                );

            case 'embed':
                return (
                    <div className="my-6 aspect-video rounded-xl overflow-hidden border border-gray-200">
                        <iframe src={value.url} className="w-full h-full" allowFullScreen />
                    </div>
                );

            case 'file':
                const fileUrl = value.type === 'external' ? value.external?.url : value.file?.url;
                const fileName = value.name || fileUrl?.split('/').pop() || 'Download File';
                return (
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="my-4 flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                    >
                        <span className="text-2xl">📎</span>
                        <span className="flex-1 text-gray-700 group-hover:text-blue-600">{fileName}</span>
                        <span className="text-sm text-gray-400">↓</span>
                    </a>
                );

            case 'pdf':
                const pdfUrl = value.type === 'external' ? value.external?.url : value.file?.url;
                return (
                    <div className="my-6">
                        <iframe src={pdfUrl} className="w-full h-96 rounded-xl border border-gray-200" />
                        {value.caption && value.caption.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2 text-center">{text(value.caption)}</p>
                        )}
                    </div>
                );

            case 'image':
                let imgUrl = '';
                if (value.type === 'external') {
                    imgUrl = value.external.url;
                } else if (value.type === 'file') {
                    imgUrl = `/api/image?blockId=${id}`;
                }

                const imgCaption = value.caption ? text(value.caption) : '';
                return (
                    <figure className="my-8">
                        <img
                            src={imgUrl}
                            alt={getPlainText(value.caption) || ''}
                            className="w-full rounded-2xl shadow-sm border border-gray-100"
                            loading="lazy"
                            onError={(e) => {
                                // 이미지 로드 실패시 플레이스홀더로 대체
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100', 'h-48', 'flex', 'items-center', 'justify-center');
                            }}
                        />
                        {imgCaption && <figcaption className="text-center text-sm text-gray-500 mt-3">{imgCaption}</figcaption>}
                    </figure>
                );

            case 'column_list':
                return (
                    <div className="my-6 flex flex-col md:flex-row gap-4">
                        {block.children?.map(column => (
                            <div key={column.id} className="flex-1">
                                {column.children && groupBlocks(column.children).map(child => renderGroupedBlock(child))}
                            </div>
                        ))}
                    </div>
                );

            case 'column':
                return (
                    <>
                        {block.children && groupBlocks(block.children).map(child => renderGroupedBlock(child))}
                    </>
                );

            case 'table_of_contents':
                return (
                    <nav className="my-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span>📑</span> {i18n.language === 'ko' ? '목차' : 'Table of Contents'}
                        </p>
                    </nav>
                );

            case 'equation':
                return (
                    <div className="my-4 p-4 bg-gray-50 rounded-xl text-center font-mono overflow-x-auto">
                        {value.expression}
                    </div>
                );

            case 'synced_block':
                return (
                    <>
                        {block.children && groupBlocks(block.children).map(child => renderGroupedBlock(child))}
                    </>
                );

            case 'divider':
                return <hr className="my-10 border-gray-200" />;

            case 'audio':
                const audioUrl = value.type === 'external' ? value.external?.url : value.file?.url;
                return (
                    <div className="my-6">
                        <audio src={audioUrl} controls className="w-full" />
                        {value.caption && value.caption.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2 text-center">{text(value.caption)}</p>
                        )}
                    </div>
                );

            default:
                console.log('Unsupported block type:', type);
                return null;
        }
    };

    // 그룹화된 블록 렌더링
    const renderGroupedBlock = (block) => {
        if (block.type === 'bulleted_list') {
            return (
                <ul key={block.id} className="my-4 ml-6 space-y-2 list-disc text-gray-700">
                    {block.items.map(item => (
                        <React.Fragment key={item.id}>
                            {renderBlock(item)}
                        </React.Fragment>
                    ))}
                </ul>
            );
        }

        if (block.type === 'numbered_list') {
            return (
                <ol key={block.id} className="my-4 ml-6 space-y-2 list-decimal text-gray-700">
                    {block.items.map(item => (
                        <React.Fragment key={item.id}>
                            {renderBlock(item)}
                        </React.Fragment>
                    ))}
                </ol>
            );
        }

        if (block.type === 'to_do_list') {
            return (
                <div key={block.id} className="my-4 space-y-1">
                    {block.items.map(item => (
                        <React.Fragment key={item.id}>
                            {renderBlock(item)}
                        </React.Fragment>
                    ))}
                </div>
            );
        }

        return <React.Fragment key={block.id}>{renderBlock(block)}</React.Fragment>;
    };

    if (!post) return null;

    const seoTitle = post.metaTitle || post.title;
    const seoDescription = post.metaDescription || post.excerpt;
    const canonicalUrl = `https://www.remitbuddy.com/blog/${post.slug}`;
    const ogImage = post.cover || 'https://www.remitbuddy.com/og-default.png';

    // JSON-LD structured data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: seoDescription,
        image: ogImage,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
            '@type': 'Organization',
            name: 'RemitBuddy',
            url: 'https://www.remitbuddy.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'RemitBuddy',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.remitbuddy.com/logo.png'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl
        },
        keywords: post.tags?.join(', ')
    };

    return (
        <>
            <Head>
                {/* Primary Meta Tags */}
                <title>{seoTitle} | RemitBuddy Blog</title>
                <meta name="title" content={`${seoTitle} | RemitBuddy Blog`} />
                <meta name="description" content={seoDescription} />
                {post.tags?.length > 0 && (
                    <meta name="keywords" content={post.tags.join(', ')} />
                )}
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:site_name" content="RemitBuddy" />
                {post.publishedAt && (
                    <meta property="article:published_time" content={post.publishedAt} />
                )}
                {post.tags?.map(tag => (
                    <meta property="article:tag" content={tag} key={tag} />
                ))}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={canonicalUrl} />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={ogImage} />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
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

                        {/* Cover Image - Optimized for mobile */}
                        {post.cover && (
                            <div className="mb-12 rounded-3xl overflow-hidden shadow-lg border border-gray-100 aspect-video relative">
                                {post.cover.startsWith('/') ? (
                                    <Image
                                        src={post.cover}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 768px"
                                    />
                                ) : (
                                    <img src={post.cover} alt={post.title} className="w-full h-full object-cover" loading="eager" />
                                )}
                            </div>
                        )}

                        {/* Post Content */}
                        <div className="prose prose-lg prose-blue max-w-none text-gray-700">
                            {groupBlocks(post.blocks).map((block) => renderGroupedBlock(block))}
                        </div>

                        {/* Related Posts Section */}
                        <RelatedPosts posts={relatedPosts} lang={i18n.language} />

                        {/* Soft CTA: Contextual, not aggressive */}
                        <div className="mt-12 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-100 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">💡</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-2">
                                        {i18n.language === 'ko' ? '송금 비용 궁금하신가요?' : 'Curious about transfer costs?'}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {i18n.language === 'ko'
                                            ? 'RemitBuddy에서 실시간 환율과 수수료를 비교해보세요.'
                                            : 'Compare live exchange rates and fees on RemitBuddy.'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={buildCtaLink('/', post.slug, 'bottom_cta') + '&amount=1000000'}
                                            onClick={() => trackCtaClick(post.slug, 'bottom_cta', 1000000)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            {i18n.language === 'ko' ? '비교 도구 열기 →' : 'Open comparison tool →'}
                                        </Link>
                                        <Link
                                            href="/blog"
                                            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            {i18n.language === 'ko' ? '더 많은 가이드 보기' : 'More guides'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </article>

                <Footer />
            </div>
        </>
    );
};

export async function getStaticPaths() {
    const [koPosts, enPosts] = await Promise.all([
        getPublishedPosts('ko'),
        getPublishedPosts('en'),
    ]);

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
            revalidate: 60,
        };
    }

    // Fetch related posts based on tag similarity
    const relatedPosts = await getRelatedPosts(params.slug, post.tags || [], locale, 3);

    return {
        props: {
            post,
            relatedPosts,
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 60,
    };
}

export default BlogPost;

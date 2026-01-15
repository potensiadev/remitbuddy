import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "../../../lib/notion";
import "../../../styles/blog.css";

export async function generateStaticParams() {
    const posts = await getPublishedPosts();
    if (!Array.isArray(posts)) return [];

    return posts
        .filter((p) => typeof p?.slug === "string" && p.slug.length > 0)
        .map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const slug = params?.slug;
    if (!slug) notFound();

    const post = await getPostBySlug(slug);
    if (!post) notFound();

    const blocks = Array.isArray(post.blocks) ? post.blocks : [];

    return (
        <article className="blog-article">
            <h1 className="blog-title">{post.title}</h1>

            {post.excerpt && (
                <p className="blog-excerpt">{post.excerpt}</p>
            )}

            <section className="blog-content">
                {blocks.map((block: any, index: number) => {
                    const type = block?.type;

                    const text = (arr?: any[]) =>
                        Array.isArray(arr)
                            ? arr.map((t) => t.plain_text).join("")
                            : "";

                    if (type === "paragraph") return <p key={index}>{text(block.paragraph?.rich_text)}</p>;
                    if (type === "heading_1") return <h1 key={index}>{text(block.heading_1?.rich_text)}</h1>;
                    if (type === "heading_2") return <h2 key={index}>{text(block.heading_2?.rich_text)}</h2>;
                    if (type === "heading_3") return <h3 key={index}>{text(block.heading_3?.rich_text)}</h3>;
                    if (type === "quote") return <blockquote key={index}>{text(block.quote?.rich_text)}</blockquote>;
                    if (type === "divider") return <hr key={index} />;

                    if (type === "bulleted_list_item") {
                        return (
                            <ul key={index}>
                                <li>{text(block.bulleted_list_item?.rich_text)}</li>
                            </ul>
                        );
                    }

                    if (type === "numbered_list_item") {
                        return (
                            <ol key={index}>
                                <li>{text(block.numbered_list_item?.rich_text)}</li>
                            </ol>
                        );
                    }

                    if (type === "image") {
                        const url = block.image?.external?.url || block.image?.file?.url;
                        if (!url) return null;
                        const alt = text(block.image?.caption);
                        return <img key={index} src={url} alt={alt} loading="lazy" />;
                    }

                    return null;
                })}
            </section>

            <section className="blog-cta">
                <p>Stop overpaying on international transfers.</p>
                <a href="/">See best rates</a>
            </section>
        </article>
    );
}

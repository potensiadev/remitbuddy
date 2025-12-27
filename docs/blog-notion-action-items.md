# Notion blog integration: next action items

The following items remain after reviewing the current Notion-driven blog implementation and the checklist shared earlier.

1. **Lockfile alignment for the Notion SDK**  
   `@notionhq/client` is listed in `frontend/package.json`, but the lockfile was not updated due to the previous install failure. Regenerate the frontend lockfile (or add a dedicated one under `frontend/`) so deployments use the SDK version that matches the manifest.  
   Relevant file: `frontend/package.json`.

2. **Query filtering and pagination safety**  
   `getPublishedPosts` currently pulls every row from the database and filters for `Published` in memory. Add a Notion filter for published posts and handle pagination (use `start_cursor`/`has_more`) so large databases and drafts do not inflate build times.  
   Relevant file: `frontend/lib/notionClient.js`.

3. **Block rendering coverage and structure**  
   The custom renderer only supports a few block types and creates a new `<ul>`/`<ol>` wrapper per list item, which breaks nested list semantics. Either adopt `react-notion-x` for full fidelity or extend the renderer to group list items, support toggles, callouts, tables, equations, embeds, and sync blocks, and render children outside of `<p>` tags where appropriate.  
   Relevant file: `frontend/pages/blog/[slug].js`.

4. **SEO and social metadata**  
   Blog detail pages set a title/description and OG image, but omit canonical URLs and Twitter/Open Graph card metadata. Add canonical tags, `og:title`, `og:description`, and Twitter card tags derived from the Notion metadata to improve share previews.  
   Relevant file: `frontend/pages/blog/[slug].js`.

5. **Runtime resilience and telemetry**  
   Introduce error logging/edge handling for Notion API failures in `getPublishedPosts`/`getPostBySlug` (e.g., return fallbacks while surfacing errors to monitoring) so ISR rebuilds do not crash the entire page. Consider adding request timeouts and retries where appropriate.  
   Relevant file: `frontend/lib/notionClient.js`.

6. **Styling and UX parity**  
   Align the blog’s typography, spacing, and media handling with the rest of the site (e.g., consistent Tailwind prose defaults, image max widths, and code block styling). Include loading states for ISR fallback pages and 404 handling.  
   Relevant files: `frontend/pages/blog/index.js`, `frontend/pages/blog/[slug].js`.

7. **Release verification**  
   Once the above changes are made, run `npm install` (with a functioning registry), `npm run lint`, and a production build (`npm run build`) to validate ISR and block rendering in a production-like environment. Capture screenshots for visual changes if applicable.

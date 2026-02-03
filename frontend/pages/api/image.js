
import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

export default async function handler(req, res) {
    const { pageId, blockId, type } = req.query;

    // Validate request
    if (!pageId && !blockId) {
        return res.status(400).json({ error: 'Missing pageId or blockId' });
    }

    try {
        let imageUrl = null;

        // Case 1: Image Block (Inline image in post body)
        if (blockId) {
            const block = await notion.blocks.retrieve({ block_id: blockId });

            if (block.type === 'image') {
                if (block.image.type === 'external') {
                    imageUrl = block.image.external.url;
                } else if (block.image.type === 'file') {
                    imageUrl = block.image.file.url;
                }
            }
        }

        // Case 2: Page Cover or Page Property Image
        else if (pageId) {
            const page = await notion.pages.retrieve({ page_id: pageId });

            // A. Property Image (e.g., from 'Image' property)
            if (type === 'property') {
                const props = page.properties;
                // Adjust property name 'Image' based on your actual Notion schema if different
                // mapPost logic uses 'Image'
                if (props.Image?.files && props.Image.files.length > 0) {
                    const fileObj = props.Image.files[0];
                    if (fileObj.type === 'external') imageUrl = fileObj.external.url;
                    else if (fileObj.type === 'file') imageUrl = fileObj.file.url;
                }
            }

            // B. Page Cover (Fallthrough if no property image found or type not specified)
            if (!imageUrl && (!type || type === 'cover')) {
                if (page.cover) {
                    if (page.cover.type === 'external') imageUrl = page.cover.external.url;
                    else if (page.cover.type === 'file') imageUrl = page.cover.file.url;
                }
            }
        }

        if (imageUrl) {
            // 307 Temporary Redirect tells the browser "Look at this URL for now, but come back to me next time"
            // This allows us to serve a fresh URL every time the proxy is called.
            // Cache-Control: s-maxage=3600 (1 hour) matching Notion's expiry time is risky if we are near expiry.
            // Safer to set a short cache on the redirect itself or just no-cache for the redirect logic, 
            // but let the browser cache the *target* image (AWS) based on its headers.
            // We'll set a short public cache for the *lookup* to reduce API hits, e.g., 5 mins.
            res.setHeader('Cache-Control', 'public, s-maxage=300, max-age=300, stale-while-revalidate=60');
            res.redirect(307, imageUrl);
        } else {
            res.status(404).json({ error: 'Image not found' });
        }

    } catch (error) {
        console.error('[ImageProxy] Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const translate = require('google-translate-api-x');

// Simple in-memory cache to avoid repeated requests during build
const translationCache = new Map();

async function translateText(text, targetLang = 'en') {
    if (!text || !text.trim()) return text;

    const cacheKey = `${text}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    try {
        const res = await translate(text, { to: targetLang });
        const translated = res.text;
        translationCache.set(cacheKey, translated);
        return translated;
    } catch (error) {
        console.error(`Translation failed for: "${text.substring(0, 20)}..."`, error);
        return text; // Fallback to original
    }
}

// Function to translate block content
async function translateBlocks(blocks, targetLang = 'en') {
    if (!blocks || !Array.isArray(blocks)) return blocks;

    const translatedBlocks = await Promise.all(blocks.map(async (block) => {
        const newBlock = JSON.parse(JSON.stringify(block)); // Deep copy using JSON
        const type = newBlock.type;
        const value = newBlock[type];

        // Helper to translate rich_text array
        const translateRichText = async (richTextObj) => {
            if (richTextObj.rich_text && Array.isArray(richTextObj.rich_text)) {
                for (const textItem of richTextObj.rich_text) {
                    if (textItem.plain_text) {
                        // Translate content
                        textItem.plain_text = await translateText(textItem.plain_text, targetLang);
                        // Also update content inside text object if present
                        if (textItem.text && textItem.text.content) {
                            textItem.text.content = textItem.plain_text;
                        }
                    }
                }
            }
        };

        // Blocks with rich_text
        const textBlocks = [
            'paragraph', 'heading_1', 'heading_2', 'heading_3',
            'bulleted_list_item', 'numbered_list_item', 'quote', 'callout', 'toggle'
        ];

        if (textBlocks.includes(type)) {
            await translateRichText(value);
        }

        // Handle Images with Captions
        if (type === 'image' && value.caption) {
            for (const textItem of value.caption) {
                if (textItem.plain_text) {
                    textItem.plain_text = await translateText(textItem.plain_text, targetLang);
                    if (textItem.text && textItem.text.content) {
                        textItem.text.content = textItem.plain_text;
                    }
                }
            }
        }

        return newBlock;
    }));

    return translatedBlocks;
}

module.exports = {
    translateText,
    translateBlocks
};

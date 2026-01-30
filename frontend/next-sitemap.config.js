/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.remitbuddy.com',
    generateRobotsTxt: true,
    sitemapSize: 5000,

    // Exclude server-side and API routes
    exclude: ['/server-sitemap.xml', '/api/*', '/admin/*'],

    // Custom transform function to set priorities and changefreq
    transform: async (config, path) => {
        // Determine priority based on page type
        let priority = 0.5;
        let changefreq = 'weekly';

        // Amount × Country pages - high priority
        if (path.startsWith('/send/')) {
            priority = 0.8;
            changefreq = 'daily';
        }
        // Provider comparison pages - medium-high priority
        else if (path.startsWith('/compare/')) {
            priority = 0.7;
            changefreq = 'daily';
        }
        // Currency pair pages - medium-high priority
        else if (path.startsWith('/krw-to/')) {
            priority = 0.7;
            changefreq = 'hourly';
        }
        // Purpose-based pages - medium priority
        else if (path.startsWith('/send-for/')) {
            priority = 0.6;
            changefreq = 'weekly';
        }
        // Guide pages - medium priority
        else if (path.startsWith('/guides/')) {
            priority = 0.6;
            changefreq = 'weekly';
        }
        // Existing country pages - high priority
        else if (path.startsWith('/send-to/')) {
            priority = 0.8;
            changefreq = 'daily';
        }
        // Homepage - highest priority
        else if (path === '/') {
            priority = 1.0;
            changefreq = 'hourly';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
            // Add hreflang alternates for bilingual pages
            alternateRefs: [
                {
                    href: `https://www.remitbuddy.com${path}`,
                    hreflang: 'en',
                },
                {
                    href: `https://www.remitbuddy.com/ko${path}`,
                    hreflang: 'ko',
                },
                {
                    href: `https://www.remitbuddy.com${path}`,
                    hreflang: 'x-default',
                }
            ],
        };
    },

    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/*', '/admin/*'],
            },
        ],
        additionalSitemaps: [
            'https://www.remitbuddy.com/sitemap.xml',
        ],
    },
}


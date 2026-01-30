/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.remitbuddy.com',
    generateRobotsTxt: true,
    exclude: ['/server-sitemap.xml'], // Exclude dynamic sitemap if we add one later
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/*', '/admin/*'],
            },
        ],
    },
    // Optional: prioritization for specific pages
    priority: 0.7,
    sitemapSize: 5000,
}

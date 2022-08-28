/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mycareerlist.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  exclude: [
    '/server-sitemap-index.xml',
    '/account',
    '/account/*',
    '/companies/*',
    '/jobs/**'
  ],
  robotsTxtOptions: {
    additionalSitemaps: ['https://mycareerlist.com/server-sitemap-index.xml']
  }
}

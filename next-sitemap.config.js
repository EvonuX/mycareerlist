/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mycareerlist.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  exclude: [
    '/server-sitemap-index.xml',
    '/account',
    '/account/*',
    '/companies/*',
    '/jobs/*',
    '/jobs/*/payment'
  ],
  robotsTxtOptions: {
    additionalSitemaps: ['https://mycareerlist.com/server-sitemap-index.xml']
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mycareerlist.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  generateIndexSitemap: false,
  exclude: [
    '/account',
    '/account/*',
    '/jobs/new',
    '/companies/new',
    '/jobs/*/payment'
  ]
}

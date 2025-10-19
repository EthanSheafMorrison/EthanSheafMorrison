/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ethansheaf.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/print'],
  transform: async (config, path) => {
    return { loc: path, changefreq: 'weekly', priority: path === '/' ? 1.0 : 0.7, lastmod: new Date().toISOString() };
  },
};



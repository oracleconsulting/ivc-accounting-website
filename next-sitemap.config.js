/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ivcaccounting.co.uk',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: [
    '/admin*',
    '/client-dashboard*',
    '/api/*',
    '/404',
    '/500'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/client-dashboard', '/api']
      },
      {
        userAgent: 'GPTBot',
        allow: '/'
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/'
      },
      {
        userAgent: 'CCBot',
        allow: '/'
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/'
      },
      {
        userAgent: 'Claude-Web',
        allow: '/'
      }
    ],
    additionalSitemaps: []
  },
  transform: async (config, path) => {
    // Custom priority for important pages
    if (path === '/') return { loc: path, changefreq: 'daily', priority: 1.0 }
    if (path === '/pricing') return { loc: path, changefreq: 'weekly', priority: 0.9 }
    if (path === '/book' || path === '/contact') return { loc: path, changefreq: 'monthly', priority: 0.9 }
    if (path.includes('/services/')) return { loc: path, changefreq: 'monthly', priority: 0.8 }
    if (path.includes('/locations/')) return { loc: path, changefreq: 'monthly', priority: 0.8 }
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
} 
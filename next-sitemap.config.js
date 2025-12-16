/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.torressantiago.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/chat-app/*', '/api/*', '/redesign'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/chat-app', '/api', '/redesign'] },
    ],
  },
  transform: async (config, path) => {
    // Custom priority para diferentes tipos de páginas
    let priority = 0.7
    let changefreq = 'weekly'

    // Homepage - Máxima prioridad
    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    }

    // Servicios - Muy alta prioridad (conversión directa)
    else if (path === '/servicios') {
      priority = 0.95
      changefreq = 'weekly'
    } else if (path.startsWith('/servicios/')) {
      priority = 0.9
      changefreq = 'weekly'
    }

    // Blog - Alta prioridad (SEO content)
    else if (path === '/blog') {
      priority = 0.9
      changefreq = 'daily'
    } else if (path.startsWith('/blog/categoria/')) {
      priority = 0.82
      changefreq = 'weekly'
    } else if (path.startsWith('/blog/') && !path.includes('/feed.xml')) {
      priority = 0.8
      changefreq = 'weekly'
    }

    // Soluciones por industria - Alta prioridad (landing pages optimizadas)
    else if (path.startsWith('/soluciones/')) {
      priority = 0.85
      changefreq = 'monthly'
    }

    // Casos de estudio - Media-alta prioridad (social proof)
    else if (path === '/casos-de-estudio') {
      priority = 0.85
      changefreq = 'monthly'
    } else if (path.startsWith('/casos-de-estudio/')) {
      priority = 0.8
      changefreq = 'monthly'
    }

    // Páginas legales - Baja prioridad
    else if (path === '/privacy' || path === '/terms') {
      priority = 0.5
      changefreq = 'yearly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.torressantiago.com',  // tu dominio
    generateRobotsTxt: true,                   // genera robots.txt
    changefreq: 'daily',                       // frecuencia de cambio sugerida
    priority: 0.7,                             // prioridad por defecto
    sitemapSize: 7000,                         // partición si tienes >7k rutas
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' },        // permite todo
        // si quieres bloquear rutas privadas:
        // { userAgent: '*', disallow: ['/api', '/dashboard'] },
      ],
      additionalSitemaps: [
        'https://www.torressantiago.com/my-custom-sitemap-1.xml',
        // puedes añadir otros sitemaps si proceden
      ],
    },
  }
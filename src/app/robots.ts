import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/settings', '/profile', '/admin', '/patients', '/appointments/', '/receipt/'],
    },
    sitemap: 'https://APPONTly-7afv.vercel.app/sitemap.xml',
  }
}

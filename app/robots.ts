import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/shokuchudoku', '/lab', '/music', '/museum'],
      disallow: ['/'],
    },
    sitemap: 'https://zamakuri.jp/sitemap.xml',
  }
}

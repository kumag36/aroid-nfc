import type { MetadataRoute } from 'next'

const baseUrl = 'https://zamakuri.jp'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = ['/', '/shokuchudoku', '/lab', '/museum', '/legal', '/legal/privacy', '/legal/terms']

  return staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }))
}

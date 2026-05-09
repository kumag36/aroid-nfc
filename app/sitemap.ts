import type { MetadataRoute } from 'next'

const baseUrl = 'https://zamakuri.jp'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = ['/shokuchudoku', '/lab']

  return staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }))
}

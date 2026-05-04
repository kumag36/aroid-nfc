import { createClient } from '@supabase/supabase-js'

export type MuseumWork = {
  id: string
  title: string
  description: string
  createdAt: string
  pages: {
    path: string
    url: string
  }[]
}

type MuseumManifest = {
  id: string
  title: string
  description?: string
  createdAt: string
  pages: string[]
}

export const museumBucket = process.env.SUPABASE_MUSEUM_BUCKET ?? 'museum'

function getMuseumClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const key = serviceRoleKey || anonKey

  if (!supabaseUrl || !key) {
    return null
  }

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

function isLikelyFolder(name: string) {
  return !name.includes('.')
}

export async function listMuseumWorks(): Promise<MuseumWork[]> {
  const client = getMuseumClient()

  if (!client) {
    return []
  }

  const { data: folders, error } = await client.storage.from(museumBucket).list('works', {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  })

  if (error || !folders) {
    return []
  }

  const works = await Promise.all(
    folders
      .filter((item) => isLikelyFolder(item.name))
      .map(async (folder) => {
        const manifestPath = `works/${folder.name}/manifest.json`
        const { data: manifestFile } = await client.storage.from(museumBucket).download(manifestPath)

        if (!manifestFile) {
          return null
        }

        try {
          const manifest = JSON.parse(await manifestFile.text()) as MuseumManifest
          const signedPages = await Promise.all(
            manifest.pages.map(async (path) => {
              const { data } = await client.storage.from(museumBucket).createSignedUrl(path, 60 * 60 * 24)
              return {
                path,
                url: data?.signedUrl ?? '',
              }
            }),
          )

          return {
            id: manifest.id,
            title: manifest.title,
            description: manifest.description ?? '',
            createdAt: manifest.createdAt,
            pages: signedPages.filter((page) => page.url),
          }
        } catch {
          return null
        }
      }),
  )

  return works
    .filter((work): work is MuseumWork => Boolean(work && work.pages.length > 0))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getMuseumAdminReady() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

export function getMuseumUploadClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

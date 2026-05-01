import { createClient } from '@supabase/supabase-js'

export type MusicTrack = {
  id: string
  title: string
  artist: string
  description: string
  createdAt: string
  sourceType: 'audio' | 'youtube'
  audio?: {
    path: string
    url: string
  }
  youtube?: {
    url: string
    embedUrl: string
  }
}

type MusicManifest = {
  id: string
  title: string
  artist?: string
  description?: string
  createdAt: string
  audioPath: string
}

export const musicBucket = process.env.SUPABASE_MUSIC_BUCKET ?? 'music'

const featuredTracks: MusicTrack[] = [
  {
    id: 'youtube-bg-xq-gxr-to-ek',
    title: 'PLANT ADDICT \u30fc \u690d\u7269\u4e2d\u6bd2\ud83e\udeb4\ud83e\udd11',
    artist: 'Japanese LoFi Chanel',
    description: 'YouTube Shorts archive selected for the Zamakuri music room.',
    createdAt: '2026-05-02T00:01:00.000Z',
    sourceType: 'youtube',
    youtube: {
      url: 'https://youtube.com/shorts/BgXqGxrTOEk',
      embedUrl: 'https://www.youtube.com/embed/BgXqGxrTOEk',
    },
  },
  {
    id: 'youtube-ria-mk3-st-skg',
    title: '\u690d\u7269\u4e2d\u6bd2\ud83e\udeb4\ud83e\udd11 \uff5e PLANT ADDICT',
    artist: 'Japanese LoFi Chanel',
    description: 'YouTube Shorts archive selected for the Zamakuri music room.',
    createdAt: '2026-05-02T00:00:00.000Z',
    sourceType: 'youtube',
    youtube: {
      url: 'https://youtube.com/shorts/RiaMk3StSkg?feature=share',
      embedUrl: 'https://www.youtube.com/embed/RiaMk3StSkg',
    },
  },
]

function getMusicClient() {
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

export async function listMusicTracks(): Promise<MusicTrack[]> {
  const client = getMusicClient()

  if (!client) {
    return featuredTracks
  }

  const { data: folders, error } = await client.storage.from(musicBucket).list('tracks', {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  })

  if (error || !folders) {
    return featuredTracks
  }

  const tracks = await Promise.all(
    folders
      .filter((item) => isLikelyFolder(item.name))
      .map(async (folder): Promise<MusicTrack | null> => {
        const manifestPath = `tracks/${folder.name}/manifest.json`
        const { data: manifestFile } = await client.storage.from(musicBucket).download(manifestPath)

        if (!manifestFile) {
          return null
        }

        try {
          const manifest = JSON.parse(await manifestFile.text()) as MusicManifest
          const { data } = await client.storage.from(musicBucket).createSignedUrl(manifest.audioPath, 60 * 60 * 24)

          if (!data?.signedUrl) {
            return null
          }

          return {
            id: manifest.id,
            title: manifest.title,
            artist: manifest.artist ?? 'ZAMAKURI PLANTS',
            description: manifest.description ?? '',
            createdAt: manifest.createdAt,
            sourceType: 'audio' as const,
            audio: {
              path: manifest.audioPath,
              url: data.signedUrl,
            },
          }
        } catch {
          return null
        }
      }),
  )

  const uploadedTracks = tracks
    .filter((track): track is MusicTrack => Boolean(track))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return [...featuredTracks, ...uploadedTracks]
}

export function getMusicAdminReady() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      (process.env.MUSIC_ADMIN_PASSWORD || process.env.MUSEUM_ADMIN_PASSWORD),
  )
}

export function verifyMusicPassword(password: string) {
  const expected = process.env.MUSIC_ADMIN_PASSWORD || process.env.MUSEUM_ADMIN_PASSWORD
  return Boolean(expected && password === expected)
}

export function getMusicUploadClient() {
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

export async function ensureMusicBucket() {
  const client = getMusicUploadClient()

  if (!client) {
    return { ok: false, message: 'Storage client is not ready.' }
  }

  const { data: buckets } = await client.storage.listBuckets()
  const exists = buckets?.some((bucket) => bucket.name === musicBucket)

  if (exists) {
    return { ok: true }
  }

  const { error } = await client.storage.createBucket(musicBucket, {
    public: false,
    fileSizeLimit: 1024 * 1024 * 120,
    allowedMimeTypes: [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/aac',
      'audio/ogg',
      'audio/webm',
    ],
  })

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}

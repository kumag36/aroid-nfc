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

const localAudioTracks: MusicTrack[] = [
  {
    id: 'audio-shokubutsu-chudoku',
    title: '\u690d\u7269\u4e2d\u6bd2',
    artist: 'ZAMAKURI PLANTS',
    description: '\u3056\u307e\u304f\u308a\u97f3\u697d\u5ba4\u306b\u53ce\u9332\u3057\u305f\u30aa\u30ea\u30b8\u30ca\u30eb\u97f3\u6e90\u3002\u30e9\u30b8\u30ab\u30bb\u30dc\u30bf\u30f3\u3067\u518d\u751f\u3067\u304d\u307e\u3059\u3002',
    createdAt: '2026-05-02T01:03:00.000Z',
    sourceType: 'audio',
    audio: {
      path: 'public/music/shokubutsu-chudoku.mp3',
      url: '/music/shokubutsu-chudoku.mp3',
    },
  },
  {
    id: 'audio-plant-addict',
    title: 'PLANT ADDICT',
    artist: 'ZAMAKURI PLANTS',
    description: '\u690d\u7269\u3078\u306e\u71b1\u3092\u97f3\u306b\u3057\u305f\u30aa\u30ea\u30b8\u30ca\u30eb\u97f3\u6e90\u3002\u30e9\u30b8\u30ab\u30bb\u30dc\u30bf\u30f3\u3067\u518d\u751f\u3067\u304d\u307e\u3059\u3002',
    createdAt: '2026-05-02T01:02:00.000Z',
    sourceType: 'audio',
    audio: {
      path: 'public/music/plant-addict.mp3',
      url: '/music/plant-addict.mp3',
    },
  },
  {
    id: 'audio-my-green-angel',
    title: 'MY GREEN ANGEL',
    artist: 'ZAMAKURI PLANTS',
    description: '\u3056\u307e\u304f\u308a\u30d7\u30e9\u30f3\u30c4\u306e\u4e16\u754c\u89b3\u306b\u5bc4\u308a\u6dfb\u3046\u30aa\u30ea\u30b8\u30ca\u30eb\u97f3\u6e90\u3002',
    createdAt: '2026-05-02T01:01:00.000Z',
    sourceType: 'audio',
    audio: {
      path: 'public/music/my-green-angel.mp3',
      url: '/music/my-green-angel.mp3',
    },
  },
  {
    id: 'audio-my-green-angel-zamakuri-var',
    title: 'MY GREEN ANGEL - ZAMAKURI var.',
    artist: 'ZAMAKURI PLANTS',
    description: '\u3056\u307e\u304f\u308a\u30d0\u30fc\u30b8\u30e7\u30f3\u3068\u3057\u3066\u53ce\u9332\u3057\u305f\u97f3\u6e90\u3002\u30e9\u30b8\u30ab\u30bb\u30dc\u30bf\u30f3\u3067\u518d\u751f\u3067\u304d\u307e\u3059\u3002',
    createdAt: '2026-05-02T01:00:00.000Z',
    sourceType: 'audio',
    audio: {
      path: 'public/music/my-green-angel-zamakuri-var.mp3',
      url: '/music/my-green-angel-zamakuri-var.mp3',
    },
  },
]

const featuredTracks: MusicTrack[] = [
  {
    id: 'youtube-5royjnkiqe0',
    title: 'MY GREEN ANGEL \uff5e ZAMAKURI ver. \uff5e \ud83c\udf3f \u904b\u547d\u306e\u51fa\u4f1a\u3044\u3092\u90aa\u9b54\u3057\u306b\u304f\u308b\u5974\u3089\u73fe\u308b\u3010\u662d\u548c\u30b9\u30ab\u30ec\u30b2\u30a8\u3011',
    artist: 'Japanese LoFi Chanel',
    description: 'YouTube Shorts archive selected for the Zamakuri music room.',
    createdAt: '2026-05-02T00:03:00.000Z',
    sourceType: 'youtube',
    youtube: {
      url: 'https://youtube.com/shorts/5ROYJNkIqE0',
      embedUrl: 'https://www.youtube.com/embed/5ROYJNkIqE0',
    },
  },
  {
    id: 'youtube-ofiwx52ggag',
    title: 'MY GREEN ANGEL \ud83c\udf3f\uff5c\u904b\u547d\u306e\u3072\u3068\u682a\u306b\u51fa\u4f1a\u3063\u305f\u77ac\u9593\uff08\u662d\u548c\u30b9\u30ab\u30ec\u30b2\u30a8\uff09',
    artist: 'Japanese LoFi Chanel',
    description: 'YouTube video archive selected for the Zamakuri music room.',
    createdAt: '2026-05-02T00:02:00.000Z',
    sourceType: 'youtube',
    youtube: {
      url: 'https://youtu.be/OFiWX52ggag',
      embedUrl: 'https://www.youtube.com/embed/OFiWX52ggag',
    },
  },
  {
    id: 'youtube-fu-p2y-nte08g',
    title: 'PLANT ADDICT \ud83e\udeb4\ud83e\udd11\uff5c\u690d\u7269\u4e2d\u6bd2\uff08\u3057\u3087\u304f\u3061\u3085\u3046\u3069\u304f\uff09\uff5c\u662d\u548c\u30b9\u30ab\u30ec\u30b2\u30a8 \u00d7 \u89b3\u8449\u690d\u7269',
    artist: 'Japanese LoFi Chanel',
    description: 'YouTube Shorts archive selected for the Zamakuri music room.',
    createdAt: '2026-05-02T00:01:00.000Z',
    sourceType: 'youtube',
    youtube: {
      url: 'https://youtube.com/shorts/fuP2yNTE08g',
      embedUrl: 'https://www.youtube.com/embed/fuP2yNTE08g',
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
      url: 'https://youtube.com/shorts/RiaMk3StSkg',
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
    return [...localAudioTracks, ...featuredTracks]
  }

  const { data: folders, error } = await client.storage.from(musicBucket).list('tracks', {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  })

  if (error || !folders) {
    return [...localAudioTracks, ...featuredTracks]
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

  return [...localAudioTracks, ...featuredTracks, ...uploadedTracks]
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

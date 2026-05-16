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

function bundledPages(slug: string, count: number, extension = 'webp') {
  return Array.from({ length: count }, (_, index) => {
    const filename = `${String(index + 1).padStart(2, '0')}-${slug}.${extension}`
    return {
      path: `/museum/${slug}/${filename}`,
      url: `/museum/${slug}/${filename}`,
    }
  })
}

const bundledMuseumWorks: MuseumWork[] = [
  {
    id: 'episode-010-leaf-underside-check',
    title: '第10話｜葉裏チェックは虫予防',
    description:
      'モンステラを見る時は葉の表だけでなく、葉裏、新芽まわり、茎のつけ根も確認します。白い点々、細い糸、ベタつきなどの小さなサインに早く気づくための虫予防の話です。',
    createdAt: '2026-05-09T00:16:27.000Z',
    pages: bundledPages('episode-010-leaf-underside-check', 5, 'png'),
  },
  {
    id: 'episode-009-fertilizer-is-not-medicine',
    title: '第9話｜肥料は元気の薬じゃない',
    description:
      '肥料は弱った時の薬ではなく、生育期を支えるごはん。まず土の乾き、置き場所、根と葉を確認し、濃さと回数はラベル通りにします。',
    createdAt: '2026-05-08T05:22:09.000Z',
    pages: bundledPages('episode-009-fertilizer-is-not-medicine', 5, 'png'),
  },
  {
    id: 'episode-008-leaf-clean',
    title: '第8話｜水垢にはリーフクリン',
    description:
      'モンステラの白い跡は水垢かもしれません。リーフクリンは缶をよく振り、葉から適度に離して表面へスプレー。拭き取らず自然に乾くまで待つのがコツです。',
    createdAt: '2026-05-07T06:16:57.000Z',
    pages: bundledPages('episode-008-leaf-clean', 5, 'png'),
  },
  {
    id: 'episode-007-monstera-placement',
    title: '第7話｜モンステラの置き場所',
    description:
      'モンステラは光が好きですが、暗すぎる場所や強すぎる直射日光は苦手です。葉の向きと新芽を見ながら、レースカーテン越しの明るい日陰へ整えます。',
    createdAt: '2026-05-06T22:54:06.000Z',
    pages: bundledPages('episode-007-monstera-placement', 5, 'png'),
  },
  {
    id: 'monstera-leaf-mist',
    title: '第6話｜モンステラの葉水',
    description:
      'モンステラの葉水は、朝に軽く。ほこり、乾いた空気、葉の元気を見て、細かい霧を葉の表へ軽くかけます。夜は乾きにくく水が残りやすいので、びしょびしょにしないことが大切です。',
    createdAt: '2026-05-06T07:54:26.000Z',
    pages: bundledPages('monstera-leaf-mist', 5, 'png'),
  },
  {
    id: 'monstera-weekend-watering',
    title: '第5話｜水やりは土日で整える',
    description:
      'モンステラの水やりを土日のサイクルで整える話。土をさわる、鉢を持つ、葉を見る。平日は追加せず見守り、次の土日に乾きと鉢の軽さを確認して、乾いていたらたっぷり水やりします。',
    createdAt: '2026-05-05T07:04:11.000Z',
    pages: bundledPages('monstera-weekend-watering', 5, 'png'),
  },
  {
    id: 'monstera-repotting',
    title: '第4話｜モンステラの植え替え',
    description:
      'モンステラの植え替えサインを見つける話。鉢が乾かない、新芽が止まる、根がちらりと見える。根詰まりで土のすき間や水の逃げ道がなくなったら、一回り大きい鉢と新しい土で整えます。',
    createdAt: '2026-05-03T16:47:37.000Z',
    pages: bundledPages('monstera-repotting', 5),
  },
  {
    id: 'episode-003-yellow-leaves',
    title: '第3話｜葉が黄色くなるサイン',
    description:
      'モンステラの葉が黄色くなると焦りますが、黄色い葉は終わりとは限りません。下葉だけ、全体が薄い、葉先だけなど場所を見て、水・光・寒さ・根のストレスを順に確認します。',
    createdAt: '2026-05-08T23:46:32.000Z',
    pages: bundledPages('episode-003-yellow-leaves', 5, 'png'),
  },
  {
    id: 'episode-002-overwatering',
    title: '第2話｜水をあげすぎる理由',
    description:
      '植物が心配で、つい水を足したくなることがあります。でも根には水だけでなく空気も必要です。土がずっと湿っていたり、鉢が重いままなら、今日は待つ日かもしれません。',
    createdAt: '2026-05-02T13:39:54.000Z',
    pages: bundledPages('episode-002-overwatering', 5, 'png'),
  },
  {
    id: 'episode-001-why-plants-die',
    title: '第1話｜植物が枯れる本当の理由',
    description:
      '植物をすぐ枯らしてしまうと、自分には向いてないのかなと思ってしまいますよね。でも、枯れるのは才能の問題ではなく、光・水・風・土のどこかに理由があることが多いです。まず見るのは、葉の元気、土の乾き、新芽の動き。植物は言葉の代わりに、小さな変化で返事をしています。',
    createdAt: '2026-05-01T09:55:35.000Z',
    pages: bundledPages('episode-001-why-plants-die', 5, 'png'),
  },
]

function getEpisodeNumber(work: MuseumWork) {
  const match = work.title.match(/第(\d+)話/)
  return match ? Number(match[1]) : null
}

function sortMuseumWorks(works: MuseumWork[]) {
  return [...works].sort((a, b) => {
    const episodeA = getEpisodeNumber(a)
    const episodeB = getEpisodeNumber(b)

    if (episodeA && episodeB && episodeA !== episodeB) {
      return episodeA - episodeB
    }

    return a.createdAt.localeCompare(b.createdAt)
  })
}

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
    return sortMuseumWorks(bundledMuseumWorks)
  }

  const { data: folders, error } = await client.storage.from(museumBucket).list('works', {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  })

  if (error || !folders) {
    return sortMuseumWorks(bundledMuseumWorks)
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

  return sortMuseumWorks(
    [...bundledMuseumWorks, ...works].filter((work): work is MuseumWork => Boolean(work && work.pages.length > 0)),
  )
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

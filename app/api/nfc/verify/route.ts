import { NextRequest, NextResponse } from 'next/server'
import { plants } from '@/lib/dictionary-data'
import { listMuseumWorks } from '@/lib/museum-storage'
import { listMusicTracks } from '@/lib/music-storage'

type ItemRow = {
  id?: string
  uid?: string
  plant_id?: string
  name?: string | null
  name_en?: string | null
  scientific_name?: string | null
  name_jp?: string | null
  trade_name?: string | null
  slug?: string | null
}

export const dynamic = 'force-dynamic'

function normalizeUid(uid: string) {
  return uid.trim().toUpperCase()
}

function normalizeItem(row: ItemRow): ItemRow {
  return {
    id: row.id ?? row.uid ?? row.plant_id,
    name_en: row.name_en ?? row.scientific_name ?? row.name,
    name_jp: row.name_jp ?? row.trade_name,
    slug: row.slug,
  }
}

async function fetchItem(uid: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      status: 'error' as const,
      code: 'SUPABASE_ENV_MISSING',
      message: 'Supabase environment variables are missing.',
      item: null,
    }
  }

  try {
    const endpoint = new URL('/rest/v1/items', supabaseUrl)
    endpoint.searchParams.set('id', `eq.${uid}`)
    endpoint.searchParams.set('select', '*')

    const response = await fetch(endpoint.toString(), {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      return {
        status: 'error' as const,
        code: `SUPABASE_HTTP_${response.status}`,
        message: detail ? `Supabase returned ${response.status}: ${detail}` : `Supabase returned ${response.status}.`,
        item: null,
      }
    }

    const rows = (await response.json()) as ItemRow[]

    if (!rows[0]) {
      return {
        status: 'not_registered' as const,
        code: 'PLANT_ID_NOT_REGISTERED',
        message: 'この植物IDは登録されておりません。管理局にお問い合わせください。',
        item: null,
      }
    }

    return {
      status: 'registered' as const,
      code: 'PLANT_ID_REGISTERED',
      message: 'この植物IDは登録済みです。',
      item: normalizeItem(rows[0]),
    }
  } catch {
    return {
      status: 'error' as const,
      code: 'FETCH_FAILED',
      message: 'Debug: fetch failed',
      item: null,
    }
  }
}

export async function GET(request: NextRequest) {
  const uid = normalizeUid(request.nextUrl.searchParams.get('uid') ?? '')
  const [nfc, musicTracks, museumWorks] = await Promise.all([
    uid ? fetchItem(uid) : Promise.resolve(null),
    listMusicTracks().catch(() => []),
    listMuseumWorks().catch(() => []),
  ])

  return NextResponse.json(
    {
      uid,
      nfc,
      urls: uid
        ? {
            individual: `/i/${encodeURIComponent(uid)}`,
            legacy: `/nfc/${encodeURIComponent(uid)}`,
            registration: `/register?uid=${encodeURIComponent(uid)}`,
            writeUrl: `https://zamakuri.jp/i/${encodeURIComponent(uid)}`,
          }
        : null,
      database: {
        dictionary: {
          status: 'ready',
          label: 'アロイド図鑑DB',
          count: plants.length,
          detail: '品種データ、詳細ページ、画像紐づけの土台を実装済みです。',
        },
        nfcItems: {
          status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'connected' : 'missing_env',
          label: 'NFC個体管理DB',
          count: nfc?.item ? 1 : 0,
          detail: 'UID検証、個体ページ、未登録時の案内、登録申請導線を実装済みです。',
        },
        music: {
          status: 'ready',
          label: '音楽室DB',
          count: musicTracks.length,
          detail: 'ローカルMP3、YouTube情報、アップロード曲を同じ音楽室に統合しています。',
        },
        museum: {
          status: 'ready',
          label: '美術館DB',
          count: museumWorks.length,
          detail: '管理者アップロードとギャラリー表示を実装済みです。',
        },
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    },
  )
}

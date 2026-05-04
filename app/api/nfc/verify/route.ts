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
        message: 'この植物IDは登録されておりません。管理画面から登録してください。',
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
            registration: `/admin/items/new?id=${encodeURIComponent(uid)}`,
            writeUrl: `https://zamakuri.jp/i/${encodeURIComponent(uid)}`,
          }
        : null,
      database: {
        dictionary: {
          status: 'ready',
          label: '図鑑DB',
          count: plants.length,
          detail: '品種データと図鑑ページを管理しています。',
        },
        nfcItems: {
          status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'connected' : 'missing_env',
          label: 'NFC個体DB',
          count: nfc?.item ? 1 : 0,
          detail: 'UID確認、個体ページ、未登録時の登録導線を確認します。',
        },
        music: {
          status: 'ready',
          label: '音楽DB',
          count: musicTracks.length,
          detail: '音楽室の登録トラックを確認します。',
        },
        museum: {
          status: 'ready',
          label: '漫画部屋DB',
          count: museumWorks.length,
          detail: '管理アップロードとギャラリー表示を確認します。',
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
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
        message: 'This NFC plant ID is not registered yet.',
        item: null,
      }
    }

    return {
      status: 'registered' as const,
      code: 'PLANT_ID_REGISTERED',
      message: 'This NFC plant ID is registered.',
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
          label: 'Aroid dictionary DB',
          count: plants.length,
          detail: 'Dictionary entries and detail pages are implemented.',
        },
        nfcItems: {
          status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'connected' : 'missing_env',
          label: 'NFC individual DB',
          count: nfc?.item ? 1 : 0,
          detail: 'UID verification, individual pages, unregistered guidance, and registration flow are implemented.',
        },
        music: {
          status: 'ready',
          label: 'Music room DB',
          count: musicTracks.length,
          detail: 'Local MP3, YouTube, and uploaded tracks are shown in one room.',
        },
        museum: {
          status: 'ready',
          label: 'Museum DB',
          count: museumWorks.length,
          detail: 'Admin upload and gallery display are implemented.',
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

export type NfcItem = {
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

export type NfcLookup =
  | { status: 'registered'; item: NfcItem }
  | { status: 'not_registered'; code: string; message: string }
  | { status: 'error'; code: string; message: string }

export function normalizeNfcId(id: string) {
  return id.trim().toUpperCase()
}

export function getCanonicalNfcUrl(id: string) {
  return `https://zamakuri.jp/i/${encodeURIComponent(normalizeNfcId(id))}`
}

export function normalizeItem(row: NfcItem): NfcItem {
  return {
    id: row.id ?? row.uid ?? row.plant_id,
    name_en: row.name_en ?? row.scientific_name ?? row.name,
    name_jp: row.name_jp ?? row.trade_name,
    slug: row.slug,
  }
}

export async function fetchNfcItem(id: string): Promise<NfcLookup> {
  const uid = normalizeNfcId(id)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      status: 'error',
      code: 'SUPABASE_ENV_MISSING',
      message: 'Debug: Supabase environment variables are missing.',
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
        status: 'error',
        code: `SUPABASE_HTTP_${response.status}`,
        message: detail ? `Debug: Supabase returned ${response.status}: ${detail}` : `Debug: Supabase returned ${response.status}.`,
      }
    }

    const rows = (await response.json()) as NfcItem[]

    if (!rows[0]) {
      return {
        status: 'not_registered',
        code: 'PLANT_ID_NOT_REGISTERED',
        message: `Debug: plant id ${uid} is not registered.`,
      }
    }

    return {
      status: 'registered',
      item: normalizeItem(rows[0]),
    }
  } catch {
    return {
      status: 'error',
      code: 'FETCH_FAILED',
      message: 'Debug: fetch failed',
    }
  }
}

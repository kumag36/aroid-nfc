import { createClient } from '@supabase/supabase-js'

export const siteAnalyticsBucket = process.env.SUPABASE_ANALYTICS_BUCKET ?? 'analytics'
export const siteAnalyticsTable = process.env.SUPABASE_SITE_ANALYTICS_TABLE ?? 'site_pageviews'

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'bot' | 'unknown'

export type PageViewPayload = {
  id: string
  createdAt: string
  path: string
  title?: string
  referrer?: string
  source: string
  deviceType: DeviceType
  userAgent?: string
  screenWidth?: number
}

export type AnalyticsRow = {
  createdAt: string
  path: string
  referrer?: string
  source: string
  deviceType: DeviceType
  title?: string
}

export type AnalyticsSummary = {
  ready: boolean
  storage: 'table' | 'bucket' | 'unconfigured' | 'failed'
  total: number
  days: number
  pageRows: Array<{ label: string; count: number }>
  dayRows: Array<{ label: string; count: number }>
  sourceRows: Array<{ label: string; count: number }>
  deviceRows: Array<{ label: string; count: number }>
  latestRows: AnalyticsRow[]
  message?: string
}

type TablePageView = {
  created_at?: string
  path?: string
  title?: string | null
  referrer?: string | null
  source?: string | null
  device_type?: string | null
}

function getAnalyticsClient() {
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

export function getDeviceType(userAgent = ''): DeviceType {
  const value = userAgent.toLowerCase()
  if (!value) return 'unknown'
  if (/bot|crawler|spider|crawling|preview|facebookexternalhit|slurp/u.test(value)) return 'bot'
  if (/ipad|tablet|kindle|silk/u.test(value)) return 'tablet'
  if (/mobile|iphone|ipod|android.*mobile|windows phone/u.test(value)) return 'mobile'
  if (/android/u.test(value)) return 'tablet'
  return 'desktop'
}

export function normalizePath(value: unknown) {
  if (typeof value !== 'string') return '/'
  const trimmed = value.trim()
  if (!trimmed || !trimmed.startsWith('/')) return '/'
  return trimmed.slice(0, 240)
}

export function normalizeReferrer(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, 500)
}

export function getTrafficSource(referrer = '') {
  if (!referrer) return '直接 / 不明'

  try {
    const url = new URL(referrer)
    if (url.hostname === 'zamakuri.jp' || url.hostname.endsWith('.zamakuri.jp')) return 'サイト内'
    return url.hostname.replace(/^www\./u, '')
  } catch {
    return '直接 / 不明'
  }
}

async function ensureAnalyticsBucket() {
  const client = getAnalyticsClient()
  if (!client) return { ok: false, message: 'Supabase analytics storage is not configured.' }

  const { data: buckets } = await client.storage.listBuckets()
  const exists = buckets?.some((bucket) => bucket.name === siteAnalyticsBucket)
  if (exists) return { ok: true }

  const { error } = await client.storage.createBucket(siteAnalyticsBucket, {
    public: false,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ['application/json'],
  })

  if (error) return { ok: false, message: error.message }
  return { ok: true }
}

export async function stockPageView(payload: PageViewPayload) {
  const client = getAnalyticsClient()
  if (!client) return { ok: false, storage: 'unconfigured' as const, message: 'Supabase analytics is not configured.' }

  const tableResult = await client.from(siteAnalyticsTable).insert({
    id: payload.id,
    created_at: payload.createdAt,
    path: payload.path,
    title: payload.title ?? null,
    referrer: payload.referrer ?? null,
    source: payload.source,
    device_type: payload.deviceType,
    user_agent: payload.userAgent ?? null,
    screen_width: payload.screenWidth ?? null,
    raw: payload,
  })

  if (!tableResult.error) {
    return { ok: true, storage: 'table' as const }
  }

  const bucket = await ensureAnalyticsBucket()
  if (!bucket.ok) {
    return { ok: false, storage: 'failed' as const, message: `${tableResult.error.message} / ${bucket.message ?? 'Analytics bucket is not ready.'}` }
  }

  const storageResult = await client.storage
    .from(siteAnalyticsBucket)
    .upload(`site-pageviews/${payload.createdAt.slice(0, 10)}/${payload.id}.json`, JSON.stringify(payload, null, 2), {
      contentType: 'application/json',
      upsert: false,
    })

  if (storageResult.error) {
    return { ok: false, storage: 'failed' as const, message: `${tableResult.error.message} / ${storageResult.error.message}` }
  }

  return { ok: true, storage: 'bucket' as const }
}

function toAnalyticsRow(row: TablePageView): AnalyticsRow | null {
  if (!row.created_at || !row.path) return null
  return {
    createdAt: row.created_at,
    path: row.path,
    title: row.title ?? undefined,
    referrer: row.referrer ?? undefined,
    source: row.source ?? getTrafficSource(row.referrer ?? ''),
    deviceType: getDeviceType(row.device_type === 'desktop' || row.device_type === 'mobile' || row.device_type === 'tablet' || row.device_type === 'bot' ? row.device_type : ''),
  }
}

function bucketPayloadToRow(payload: Partial<PageViewPayload>): AnalyticsRow | null {
  if (!payload.createdAt || !payload.path) return null
  return {
    createdAt: payload.createdAt,
    path: payload.path,
    title: payload.title,
    referrer: payload.referrer,
    source: payload.source ?? getTrafficSource(payload.referrer),
    deviceType: payload.deviceType ?? getDeviceType(payload.userAgent),
  }
}

function countBy(rows: AnalyticsRow[], getLabel: (row: AnalyticsRow) => string) {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const label = getLabel(row)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'ja'))
}

function buildSummary(rows: AnalyticsRow[], days: number, storage: AnalyticsSummary['storage'], message?: string): AnalyticsSummary {
  const sortedRows = [...rows].sort((left, right) => right.createdAt.localeCompare(left.createdAt))

  return {
    ready: storage !== 'unconfigured' && storage !== 'failed',
    storage,
    total: rows.length,
    days,
    pageRows: countBy(rows, (row) => row.path).slice(0, 30),
    dayRows: countBy(rows, (row) => row.createdAt.slice(0, 10)).sort((left, right) => right.label.localeCompare(left.label)).slice(0, days),
    sourceRows: countBy(rows, (row) => row.source || '直接 / 不明').slice(0, 30),
    deviceRows: countBy(rows, (row) => row.deviceType).slice(0, 10),
    latestRows: sortedRows.slice(0, 20),
    message,
  }
}

async function listBucketRows(days: number) {
  const client = getAnalyticsClient()
  if (!client) return { ok: false, rows: [] as AnalyticsRow[], message: 'Supabase analytics is not configured.' }

  const rows: AnalyticsRow[] = []
  const today = new Date()

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)
    const dateKey = date.toISOString().slice(0, 10)
    const { data: files } = await client.storage.from(siteAnalyticsBucket).list(`site-pageviews/${dateKey}`, {
      limit: 1000,
      sortBy: { column: 'name', order: 'desc' },
    })

    if (!files?.length) continue

    for (const file of files) {
      if (!file.name.endsWith('.json')) continue
      const { data } = await client.storage.from(siteAnalyticsBucket).download(`site-pageviews/${dateKey}/${file.name}`)
      if (!data) continue

      try {
        const row = bucketPayloadToRow(JSON.parse(await data.text()) as Partial<PageViewPayload>)
        if (row) rows.push(row)
      } catch {
        // Skip malformed archived records.
      }
    }
  }

  return { ok: true, rows }
}

export async function listAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const client = getAnalyticsClient()
  if (!client) {
    return buildSummary([], days, 'unconfigured', 'Supabase analytics is not configured.')
  }

  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await client
    .from(siteAnalyticsTable)
    .select('created_at,path,title,referrer,source,device_type')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false })
    .limit(5000)

  if (!error && data) {
    return buildSummary(data.map((row) => toAnalyticsRow(row)).filter((row): row is AnalyticsRow => Boolean(row)), days, 'table')
  }

  const bucketRows = await listBucketRows(days)
  if (bucketRows.ok) {
    return buildSummary(bucketRows.rows, days, 'bucket', error?.message)
  }

  return buildSummary([], days, 'failed', `${error?.message ?? 'Table query failed.'} / ${bucketRows.message ?? 'Bucket query failed.'}`)
}

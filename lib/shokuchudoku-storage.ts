import { createClient } from '@supabase/supabase-js'

export const shokuchudokuBucket = process.env.SUPABASE_ANALYTICS_BUCKET ?? 'analytics'
export const shokuchudokuTable = process.env.SUPABASE_SHOKUCHUDOKU_TABLE ?? 'shokuchudoku_results'

export type ShokuchudokuPayload = {
  id: string
  createdAt: string
  score: number
  maxScore: number
  level: string
  title: string
  answers: number[]
  consent: boolean
  nickname?: string
  referrer?: string
  userAgent?: string
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

export function getShokuchudokuStorageReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function ensureAnalyticsBucket() {
  const client = getAnalyticsClient()

  if (!client) {
    return { ok: false, message: 'Storage client is not ready.' }
  }

  const { data: buckets } = await client.storage.listBuckets()
  const exists = buckets?.some((bucket) => bucket.name === shokuchudokuBucket)

  if (exists) {
    return { ok: true }
  }

  const { error } = await client.storage.createBucket(shokuchudokuBucket, {
    public: false,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ['application/json'],
  })

  if (error) {
    return { ok: false, message: error.message }
  }

  return { ok: true }
}

export async function stockShokuchudokuResult(payload: ShokuchudokuPayload) {
  const client = getAnalyticsClient()

  if (!client) {
    return { ok: false, message: 'Supabase analytics storage is not configured.' }
  }

  const tableResult = await client.from(shokuchudokuTable).insert({
    id: payload.id,
    created_at: payload.createdAt,
    score: payload.score,
    max_score: payload.maxScore,
    level: payload.level,
    title: payload.title,
    answers: payload.answers,
    consent: payload.consent,
    nickname: payload.nickname ?? null,
    referrer: payload.referrer ?? null,
    user_agent: payload.userAgent ?? null,
    raw: payload,
  })

  if (!tableResult.error) {
    return { ok: true, storage: 'table' }
  }

  const bucket = await ensureAnalyticsBucket()

  if (!bucket.ok) {
    return { ok: false, message: `${tableResult.error.message} / ${bucket.message ?? 'Analytics bucket is not ready.'}` }
  }

  const storageResult = await client.storage
    .from(shokuchudokuBucket)
    .upload(`shokuchudoku/${payload.createdAt.slice(0, 10)}/${payload.id}.json`, JSON.stringify(payload, null, 2), {
      contentType: 'application/json',
      upsert: false,
    })

  if (storageResult.error) {
    return {
      ok: false,
      message: `${tableResult.error.message} / ${storageResult.error.message}`,
    }
  }

  return { ok: true, storage: 'bucket' }
}

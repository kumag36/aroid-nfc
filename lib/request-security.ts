import { NextResponse } from 'next/server'

type RateRecord = {
  count: number
  resetAt: number
}

const rateStore = new Map<string, RateRecord>()

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || request.headers.get('x-real-ip') || 'unknown'
}

export function isSameOriginRequest(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  const expectedOrigin = `${proto}://${host}`
  const allowedOrigins = new Set([
    expectedOrigin,
    'https://zamakuri.jp',
    'http://localhost:3012',
    'http://localhost:3002',
    'http://localhost:3000',
  ])
  const origin = request.headers.get('origin')

  if (origin) {
    return allowedOrigins.has(origin)
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      return allowedOrigins.has(new URL(referer).origin)
    } catch {
      return false
    }
  }

  return process.env.NODE_ENV !== 'production'
}

export function rejectCrossOrigin() {
  return NextResponse.json({ ok: false, message: 'forbidden' }, { status: 403 })
}

export function checkRateLimit(request: Request, key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const ip = getRequestIp(request)
  const storeKey = `${key}:${ip}`
  const current = rateStore.get(storeKey)

  if (!current || current.resetAt <= now) {
    rateStore.set(storeKey, { count: 1, resetAt: now + windowMs })
    return null
  }

  current.count += 1

  if (current.count <= limit) {
    return null
  }

  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
  return NextResponse.json(
    { ok: false, message: 'too many requests' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
      },
    },
  )
}

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<T | null> {
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return null

  const length = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(length) && length > maxBytes) return null

  const text = await request.text()
  if (new TextEncoder().encode(text).byteLength > maxBytes) return null

  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

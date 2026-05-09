import { NextResponse } from 'next/server'
import { checkRateLimit, isSameOriginRequest, readJsonBody, rejectCrossOrigin } from '@/lib/request-security'
import { getDeviceType, getTrafficSource, normalizePath, normalizeReferrer, stockPageView } from '@/lib/site-analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RequestBody = {
  path?: unknown
  title?: unknown
  referrer?: unknown
  screenWidth?: unknown
}

function normalizeTitle(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, 160)
}

function normalizeScreenWidth(value: unknown) {
  const width = Number(value)
  if (!Number.isFinite(width) || width <= 0) return undefined
  return Math.round(Math.min(width, 10000))
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return rejectCrossOrigin()
  const rateLimited = checkRateLimit(request, 'pageview', 80, 60 * 1000)
  if (rateLimited) return rateLimited

  const body = await readJsonBody<RequestBody>(request, 2048)
  const headerReferrer = request.headers.get('referer') ?? ''
  const userAgent = request.headers.get('user-agent') ?? ''
  const referrer = normalizeReferrer(body?.referrer) || normalizeReferrer(headerReferrer)
  const createdAt = new Date().toISOString()

  const result = await stockPageView({
    id: `${Date.now()}-${crypto.randomUUID()}`,
    createdAt,
    path: normalizePath(body?.path),
    title: normalizeTitle(body?.title) || undefined,
    referrer: referrer || undefined,
    source: getTrafficSource(referrer),
    deviceType: getDeviceType(userAgent),
    userAgent: userAgent.slice(0, 500),
    screenWidth: normalizeScreenWidth(body?.screenWidth),
  })

  if (!result.ok) {
    console.warn('Pageview stock failed:', result.message)
  }

  return NextResponse.json({ ok: true, storage: result.storage })
}

import { NextResponse } from 'next/server'
import { checkRateLimit, getRequestIp, isSameOriginRequest, readJsonBody, rejectCrossOrigin } from '@/lib/request-security'
import { PreorderPickupMethod, stockPreorderRequest } from '@/lib/preorder-storage'
import { findPreorderProduct } from '@/lib/preorder-products'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RequestBody = {
  customerName?: unknown
  customerEmail?: unknown
  customerPhone?: unknown
  instagramHandle?: unknown
  productId?: unknown
  plantName?: unknown
  quantity?: unknown
  budget?: unknown
  pickupMethod?: unknown
  preferredTiming?: unknown
  note?: unknown
  company?: unknown
}

const pickupMethods = new Set<PreorderPickupMethod>(['store', 'shipping', 'event', 'consult'])

function text(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function normalizeEmail(value: unknown) {
  const email = text(value, 160).toLowerCase()
  if (!email) return ''
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : ''
}

function normalizeQuantity(value: unknown) {
  const quantity = Number(value)
  if (!Number.isFinite(quantity)) return 1
  return Math.max(1, Math.min(99, Math.round(quantity)))
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return rejectCrossOrigin()
  const rateLimited = checkRateLimit(request, 'preorder', 8, 60 * 1000)
  if (rateLimited) return rateLimited

  const body = await readJsonBody<RequestBody>(request, 8192)
  if (!body) return NextResponse.json({ ok: false, message: '送信内容を確認してください。' }, { status: 400 })
  if (text(body.company, 120)) return NextResponse.json({ ok: true })

  const customerName = text(body.customerName, 80)
  const customerEmail = normalizeEmail(body.customerEmail)
  const customerPhone = text(body.customerPhone, 40)
  const instagramHandle = text(body.instagramHandle, 80)
  const productId = text(body.productId, 120)
  const product = findPreorderProduct(productId)
  const plantName = product?.name ?? text(body.plantName, 120)
  const pickupMethod = text(body.pickupMethod, 20) as PreorderPickupMethod

  if (!customerName) {
    return NextResponse.json({ ok: false, message: 'お名前を入力してください。' }, { status: 400 })
  }

  if (!customerEmail && !customerPhone && !instagramHandle) {
    return NextResponse.json({ ok: false, message: 'メール、電話、Instagramのいずれかを入力してください。' }, { status: 400 })
  }

  if (!product) {
    return NextResponse.json({ ok: false, message: '予約商品を選択してください。' }, { status: 400 })
  }

  if (!pickupMethods.has(pickupMethod)) {
    return NextResponse.json({ ok: false, message: '受取方法を選択してください。' }, { status: 400 })
  }

  const result = await stockPreorderRequest({
    productId,
    customerName,
    customerEmail,
    customerPhone,
    instagramHandle,
    plantName,
    quantity: normalizeQuantity(body.quantity),
    budget: text(body.budget, 80),
    pickupMethod,
    preferredTiming: text(body.preferredTiming, 120),
    note: text(body.note, 1200),
    userAgent: text(request.headers.get('user-agent'), 500),
    requestIp: getRequestIp(request),
  })

  if (!result.ok) {
    console.error('Preorder stock failed:', result.message)
    return NextResponse.json(
      { ok: false, message: '保存先の設定を確認してください。' },
      { status: 503 },
    )
  }

  return NextResponse.json({ ok: true, id: result.id })
}

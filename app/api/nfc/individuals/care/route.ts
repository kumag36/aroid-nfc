import { NextRequest, NextResponse } from 'next/server'
import { addNfcCareEvent } from '@/lib/nfc-individual-storage'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null)

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ ok: false, message: '保存データが不正です。' }, { status: 400 })
  }

  const result = await addNfcCareEvent(payload)
  return NextResponse.json(result, {
    status: result.ok ? 200 : 400,
    headers: { 'Cache-Control': 'no-store' },
  })
}

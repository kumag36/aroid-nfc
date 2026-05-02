import { NextResponse } from 'next/server'
import { plants } from '@/lib/dictionary-data'
import { dictionaryImageCandidates } from '@/lib/dictionary-image-data'
import {
  getDictionaryImageAdminReady,
  listDictionaryImageAssignments,
  saveDictionaryImageAssignment,
  verifyDictionaryAdminPassword,
} from '@/lib/dictionary-image-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const plantSlug = searchParams.get('plantSlug')
  const assignments = await listDictionaryImageAssignments()
  const filteredAssignments = plantSlug
    ? assignments.filter((assignment) => assignment.plantSlug === plantSlug)
    : assignments

  return NextResponse.json({
    adminReady: getDictionaryImageAdminReady(),
    candidates: dictionaryImageCandidates,
    assignments: filteredAssignments,
    plants,
  })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
  }

  const password = String(body.password ?? '')

  if (!verifyDictionaryAdminPassword(password)) {
    return NextResponse.json({ ok: false, message: '管理者パスワードが違います。' }, { status: 401 })
  }

  const imageId = String(body.imageId ?? '')
  const plantSlug = String(body.plantSlug ?? '')
  const role = body.role === 'gallery' ? 'gallery' : 'primary'
  const note = typeof body.note === 'string' ? body.note : undefined
  const plant = plants.find((item) => item.slug === plantSlug)

  if (!plant) {
    return NextResponse.json({ ok: false, message: '品種が見つかりません。' }, { status: 400 })
  }

  const result = await saveDictionaryImageAssignment({
    imageId,
    plantSlug,
    role,
    note,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 503 })
}

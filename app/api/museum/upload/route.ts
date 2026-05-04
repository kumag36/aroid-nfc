import { NextResponse } from 'next/server'
import {
  getMuseumAdminReady,
  getMuseumUploadClient,
  museumBucket,
} from '@/lib/museum-storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getExt(file: File) {
  const fromName = file.name.split('.').pop()
  if (fromName && fromName.length <= 5) {
    return fromName.toLowerCase()
  }

  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'jpg'
}

export async function POST(request: Request) {
  if (!getMuseumAdminReady()) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Museum upload is not configured. Set SUPABASE_SERVICE_ROLE_KEY.',
      },
      { status: 503 },
    )
  }

  const formData = await request.formData()

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const files = formData.getAll('files').filter((item): item is File => item instanceof File)

  if (!title || files.length === 0) {
    return NextResponse.json({ ok: false, message: 'タイトルと画像を入れてください。' }, { status: 400 })
  }

  const client = getMuseumUploadClient()

  if (!client) {
    return NextResponse.json({ ok: false, message: 'Storage client is not ready.' }, { status: 503 })
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const pages: string[] = []

  for (const [index, file] of files.entries()) {
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ ok: false, message: '画像ファイルだけアップできます。' }, { status: 400 })
    }

    const ext = getExt(file)
    const filename = `${String(index + 1).padStart(3, '0')}-${safeName(file.name || `page.${ext}`)}`
    const path = `works/${id}/${filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`}`
    const arrayBuffer = await file.arrayBuffer()

    const { error } = await client.storage.from(museumBucket).upload(path, Buffer.from(arrayBuffer), {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }

    pages.push(path)
  }

  const manifest = {
    id,
    title,
    description,
    createdAt: new Date().toISOString(),
    pages,
  }

  const { error: manifestError } = await client.storage
    .from(museumBucket)
    .upload(`works/${id}/manifest.json`, JSON.stringify(manifest, null, 2), {
      contentType: 'application/json; charset=utf-8',
      upsert: false,
    })

  if (manifestError) {
    return NextResponse.json({ ok: false, message: manifestError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, work: manifest })
}

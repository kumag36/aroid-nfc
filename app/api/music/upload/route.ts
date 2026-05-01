import { NextResponse } from 'next/server'
import {
  ensureMusicBucket,
  getMusicAdminReady,
  getMusicUploadClient,
  musicBucket,
  verifyMusicPassword,
} from '@/lib/music-storage'

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

  if (file.type === 'audio/wav' || file.type === 'audio/x-wav') return 'wav'
  if (file.type === 'audio/mp4' || file.type === 'audio/aac') return 'm4a'
  if (file.type === 'audio/ogg') return 'ogg'
  if (file.type === 'audio/webm') return 'webm'
  return 'mp3'
}

export async function POST(request: Request) {
  if (!getMusicAdminReady()) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Music upload is not configured. Set SUPABASE_SERVICE_ROLE_KEY and an admin password.',
      },
      { status: 503 },
    )
  }

  const formData = await request.formData()
  const password = String(formData.get('password') ?? '')

  if (!verifyMusicPassword(password)) {
    return NextResponse.json({ ok: false, message: '管理者パスワードが違います。' }, { status: 401 })
  }

  const title = String(formData.get('title') ?? '').trim()
  const artist = String(formData.get('artist') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const file = formData.get('file')

  if (!title || !(file instanceof File)) {
    return NextResponse.json({ ok: false, message: 'タイトルと音源を入れてください。' }, { status: 400 })
  }

  if (!file.type.startsWith('audio/')) {
    return NextResponse.json({ ok: false, message: '音声ファイルだけアップできます。' }, { status: 400 })
  }

  const bucket = await ensureMusicBucket()

  if (!bucket.ok) {
    return NextResponse.json({ ok: false, message: bucket.message ?? 'Music bucket is not ready.' }, { status: 500 })
  }

  const client = getMusicUploadClient()

  if (!client) {
    return NextResponse.json({ ok: false, message: 'Storage client is not ready.' }, { status: 503 })
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const ext = getExt(file)
  const filename = safeName(file.name || `track.${ext}`)
  const audioPath = `tracks/${id}/${filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`}`
  const arrayBuffer = await file.arrayBuffer()

  const { error } = await client.storage.from(musicBucket).upload(audioPath, Buffer.from(arrayBuffer), {
    contentType: file.type || 'audio/mpeg',
    upsert: false,
  })

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }

  const manifest = {
    id,
    title,
    artist: artist || 'ZAMAKURI PLANTS',
    description,
    createdAt: new Date().toISOString(),
    audioPath,
  }

  const { error: manifestError } = await client.storage
    .from(musicBucket)
    .upload(`tracks/${id}/manifest.json`, JSON.stringify(manifest, null, 2), {
      contentType: 'application/json; charset=utf-8',
      upsert: false,
    })

  if (manifestError) {
    return NextResponse.json({ ok: false, message: manifestError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, track: manifest })
}

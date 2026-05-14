import { NextResponse } from 'next/server'
import { ensureNfcStorageBucket, getNfcIndividualStorageReady, getNfcUploadClient, nfcBucket } from '@/lib/nfc-individual-storage'
import { normalizeNfcId } from '@/lib/nfc-items'

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
  if (fromName && fromName.length <= 5) return fromName.toLowerCase()
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return 'jpg'
}

export async function POST(request: Request) {
  if (!getNfcIndividualStorageReady()) {
    return NextResponse.json({ ok: false, message: 'NFC storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 503 })
  }

  const formData = await request.formData()
  const uid = normalizeNfcId(String(formData.get('uid') ?? ''))
  const file = formData.get('file')

  if (!uid || !(file instanceof File)) {
    return NextResponse.json({ ok: false, message: 'UIDと写真を指定してください。' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ ok: false, message: '画像ファイルだけアップできます。' }, { status: 400 })
  }

  const bucket = await ensureNfcStorageBucket()
  if (!bucket.ok) {
    return NextResponse.json({ ok: false, message: bucket.message ?? 'NFC bucket is not ready.' }, { status: 500 })
  }

  const client = getNfcUploadClient()
  if (!client) {
    return NextResponse.json({ ok: false, message: 'Storage client is not ready.' }, { status: 503 })
  }

  const ext = getExt(file)
  const filename = safeName(file.name || `care-photo.${ext}`)
  const path = `care-images/${uid}/${Date.now()}-${filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`}`
  const arrayBuffer = await file.arrayBuffer()

  const { error } = await client.storage.from(nfcBucket).upload(path, Buffer.from(arrayBuffer), {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
  }

  const { data } = await client.storage.from(nfcBucket).createSignedUrl(path, 60 * 60 * 24)

  return NextResponse.json({ ok: true, path, url: data?.signedUrl ?? '' })
}

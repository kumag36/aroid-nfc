import { createClient } from '@supabase/supabase-js'
import {
  dictionaryImageCandidates,
  type DictionaryImageAssignment,
} from '@/lib/dictionary-image-data'

export const dictionaryBucket = process.env.SUPABASE_DICTIONARY_BUCKET ?? 'dictionary'
const assignmentsPath = 'image-links/assignments.json'

function getDictionaryAdminPassword() {
  return process.env.DICTIONARY_ADMIN_PASSWORD ?? process.env.MUSEUM_ADMIN_PASSWORD
}

function getServiceClient() {
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

export function verifyDictionaryAdminPassword(password: string) {
  const expected = getDictionaryAdminPassword()
  return Boolean(expected && password === expected)
}

export function getDictionaryImageAdminReady() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      getDictionaryAdminPassword(),
  )
}

export async function listDictionaryImageAssignments(): Promise<DictionaryImageAssignment[]> {
  const client = getServiceClient()

  if (!client) {
    return []
  }

  const { data, error } = await client.storage.from(dictionaryBucket).download(assignmentsPath)

  if (error || !data) {
    return []
  }

  try {
    const parsed = JSON.parse(await data.text())
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is DictionaryImageAssignment => {
      return Boolean(
        item &&
          typeof item.id === 'string' &&
          typeof item.imageId === 'string' &&
          typeof item.plantSlug === 'string' &&
          (item.role === 'primary' || item.role === 'gallery') &&
          typeof item.createdAt === 'string',
      )
    })
  } catch {
    return []
  }
}

export async function saveDictionaryImageAssignment(input: {
  imageId: string
  plantSlug: string
  role: 'primary' | 'gallery'
  note?: string
}) {
  const client = getServiceClient()

  if (!client) {
    return {
      ok: false,
      message: 'Dictionary image storage is not configured.',
    }
  }

  const candidate = dictionaryImageCandidates.find((item) => item.id === input.imageId)

  if (!candidate || !candidate.plantCheck.isLikelyPlant) {
    return {
      ok: false,
      message: '植物候補として扱える画像だけ紐づけできます。',
    }
  }

  const current = await listDictionaryImageAssignments()
  const nextItem: DictionaryImageAssignment = {
    id: `${input.plantSlug}-${input.imageId}-${Date.now()}`,
    imageId: input.imageId,
    plantSlug: input.plantSlug,
    role: input.role,
    note: input.note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }

  const withoutDuplicate = current.filter(
    (item) => !(item.imageId === input.imageId && item.plantSlug === input.plantSlug),
  )
  const next =
    input.role === 'primary'
      ? [
          ...withoutDuplicate.filter(
            (item) => !(item.plantSlug === input.plantSlug && item.role === 'primary'),
          ),
          nextItem,
        ]
      : [...withoutDuplicate, nextItem]

  const { error } = await client.storage
    .from(dictionaryBucket)
    .upload(assignmentsPath, JSON.stringify(next, null, 2), {
      contentType: 'application/json; charset=utf-8',
      upsert: true,
    })

  if (error) {
    return {
      ok: false,
      message: error.message,
    }
  }

  return {
    ok: true,
    assignments: next,
  }
}

import { createClient } from '@supabase/supabase-js'
import {
  dictionaryImageCandidates,
  type DictionaryImageAssignment,
  type DictionaryImageExclusion,
} from '@/lib/dictionary-image-data'

export const dictionaryBucket = process.env.SUPABASE_DICTIONARY_BUCKET ?? 'dictionary'
const assignmentsPath = 'image-links/assignments.json'
const exclusionsPath = 'image-links/exclusions.json'

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

export function verifyDictionaryAdminPassword() {
  return true
}

export function getDictionaryImageAdminReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function ensureDictionaryBucket() {
  const client = getServiceClient()

  if (!client) {
    return 'Dictionary image storage is not configured.'
  }

  const { data } = await client.storage.getBucket(dictionaryBucket)
  if (data) {
    return null
  }

  const { error } = await client.storage.createBucket(dictionaryBucket, {
    public: false,
    fileSizeLimit: 1024 * 1024 * 10,
  })

  return error?.message ?? null
}

async function readJsonArray<T>(
  path: string,
  validate: (item: unknown) => item is T,
): Promise<T[]> {
  const client = getServiceClient()

  if (!client) {
    return []
  }

  const { data, error } = await client.storage.from(dictionaryBucket).download(path)

  if (error || !data) {
    return []
  }

  try {
    const parsed = JSON.parse(await data.text())
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(validate)
  } catch {
    return []
  }
}

async function writeJson(path: string, value: unknown) {
  const bucketError = await ensureDictionaryBucket()
  if (bucketError) {
    return bucketError
  }

  const client = getServiceClient()
  if (!client) {
    return 'Dictionary image storage is not configured.'
  }

  const { error } = await client.storage
    .from(dictionaryBucket)
    .upload(path, JSON.stringify(value, null, 2), {
      contentType: 'application/json; charset=utf-8',
      upsert: true,
    })

  return error?.message ?? null
}

function isAssignment(item: unknown): item is DictionaryImageAssignment {
  return Boolean(
    item &&
      typeof item === 'object' &&
      typeof (item as DictionaryImageAssignment).id === 'string' &&
      typeof (item as DictionaryImageAssignment).imageId === 'string' &&
      typeof (item as DictionaryImageAssignment).plantSlug === 'string' &&
      ((item as DictionaryImageAssignment).role === 'primary' ||
        (item as DictionaryImageAssignment).role === 'gallery') &&
      typeof (item as DictionaryImageAssignment).createdAt === 'string',
  )
}

function isExclusion(item: unknown): item is DictionaryImageExclusion {
  return Boolean(
    item &&
      typeof item === 'object' &&
      typeof (item as DictionaryImageExclusion).id === 'string' &&
      typeof (item as DictionaryImageExclusion).imageId === 'string' &&
      typeof (item as DictionaryImageExclusion).createdAt === 'string',
  )
}

export async function listDictionaryImageAssignments() {
  return readJsonArray(assignmentsPath, isAssignment)
}

export async function listDictionaryImageExclusions() {
  return readJsonArray(exclusionsPath, isExclusion)
}

export async function saveDictionaryImageAssignment(input: {
  imageId: string
  plantSlug: string
  role: 'primary' | 'gallery'
  note?: string
}) {
  const candidate = dictionaryImageCandidates.find((item) => item.id === input.imageId)

  if (!candidate) {
    return {
      ok: false,
      message: '画像候補が見つかりません。',
    }
  }

  if (!candidate.plantCheck.isLikelyPlant) {
    return {
      ok: false,
      message: '植物候補として扱える画像だけを紐づけできます。',
    }
  }

  const currentAssignments = await listDictionaryImageAssignments()
  const currentExclusions = await listDictionaryImageExclusions()
  const nextItem: DictionaryImageAssignment = {
    id: `${input.plantSlug}-${input.imageId}-${Date.now()}`,
    imageId: input.imageId,
    plantSlug: input.plantSlug,
    role: input.role,
    note: input.note?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }

  const withoutImage = currentAssignments.filter((item) => item.imageId !== input.imageId)
  const nextAssignments =
    input.role === 'primary'
      ? [
          ...withoutImage.filter(
            (item) => !(item.plantSlug === input.plantSlug && item.role === 'primary'),
          ),
          nextItem,
        ]
      : [...withoutImage, nextItem]
  const nextExclusions = currentExclusions.filter((item) => item.imageId !== input.imageId)

  const assignmentError = await writeJson(assignmentsPath, nextAssignments)
  if (assignmentError) {
    return { ok: false, message: assignmentError }
  }

  const exclusionError = await writeJson(exclusionsPath, nextExclusions)
  if (exclusionError) {
    return { ok: false, message: exclusionError }
  }

  return {
    ok: true,
    assignments: nextAssignments,
    exclusions: nextExclusions,
  }
}

export async function excludeDictionaryImage(input: {
  imageId: string
  reason?: string
}) {
  const candidate = dictionaryImageCandidates.find((item) => item.id === input.imageId)

  if (!candidate) {
    return {
      ok: false,
      message: '画像候補が見つかりません。',
    }
  }

  const currentAssignments = await listDictionaryImageAssignments()
  const currentExclusions = await listDictionaryImageExclusions()
  const nextAssignments = currentAssignments.filter((item) => item.imageId !== input.imageId)
  const nextExclusions: DictionaryImageExclusion[] = [
    ...currentExclusions.filter((item) => item.imageId !== input.imageId),
    {
      id: `exclude-${input.imageId}-${Date.now()}`,
      imageId: input.imageId,
      reason: input.reason?.trim() || undefined,
      createdAt: new Date().toISOString(),
    },
  ]

  const assignmentError = await writeJson(assignmentsPath, nextAssignments)
  if (assignmentError) {
    return { ok: false, message: assignmentError }
  }

  const exclusionError = await writeJson(exclusionsPath, nextExclusions)
  if (exclusionError) {
    return { ok: false, message: exclusionError }
  }

  return {
    ok: true,
    assignments: nextAssignments,
    exclusions: nextExclusions,
  }
}

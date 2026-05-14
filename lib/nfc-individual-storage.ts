import { createClient } from '@supabase/supabase-js'
import { normalizeNfcId, type NfcItem } from '@/lib/nfc-items'

export type NfcStockStatus = 'draft' | 'in_stock' | 'reserved' | 'sold' | 'archived'
export type NfcSourceType = 'unknown' | 'import' | 'domestic' | 'tc' | 'division' | 'seedling'

export type NfcCareEvent = {
  id: string
  type: 'photo' | 'repot' | 'watering' | 'fertilizer' | 'treatment' | 'note'
  date: string
  note: string
  imageUrl?: string
  createdAt: string
}

export type NfcIndividual = {
  uid: string
  individualCode: string
  plantSlug?: string
  cultivarName: string
  scientificName?: string
  tradeName?: string
  sourceType: NfcSourceType
  stockStatus: NfcStockStatus
  acquiredAt?: string
  acclimationStartedAt?: string
  acclimationCompletedAt?: string
  saleAt?: string
  ownerName?: string
  ownerEmail?: string
  ownerPhone?: string
  ownerNickname?: string
  ownerAdoptedAt?: string
  lastRepottedAt?: string
  growthStatus?: string
  publicNote?: string
  privateNote?: string
  recoveryCode?: string
  replacementOfUid?: string
  careEvents: NfcCareEvent[]
  createdAt: string
  updatedAt: string
}

export type NfcIndividualInput = Partial<Omit<NfcIndividual, 'uid' | 'individualCode' | 'careEvents' | 'createdAt' | 'updatedAt'>> & {
  uid: string
  individualCode?: string
}

const nfcBucket = process.env.SUPABASE_NFC_BUCKET ?? 'nfc'
const individualsPath = 'individuals/records.json'

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return null

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function getNfcIndividualStorageReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function ensureNfcBucket() {
  const client = getServiceClient()
  if (!client) return 'NFC storage is not configured.'

  const { data } = await client.storage.getBucket(nfcBucket)
  if (data) return null

  const { error } = await client.storage.createBucket(nfcBucket, {
    public: false,
    fileSizeLimit: 1024 * 1024 * 20,
  })
  return error?.message ?? null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function optionalString(value: unknown) {
  const normalized = asString(value)
  return normalized || undefined
}

function normalizeStockStatus(value: unknown): NfcStockStatus {
  if (value === 'draft' || value === 'in_stock' || value === 'reserved' || value === 'sold' || value === 'archived') return value
  return 'draft'
}

function normalizeSourceType(value: unknown): NfcSourceType {
  if (value === 'import' || value === 'domestic' || value === 'tc' || value === 'division' || value === 'seedling') return value
  return 'unknown'
}

function normalizeCareEvents(value: unknown): NfcCareEvent[] {
  if (!Array.isArray(value)) return []
  return value
    .filter(isRecord)
    .map((item) => {
      const type: NfcCareEvent['type'] =
        item.type === 'photo' ||
        item.type === 'repot' ||
        item.type === 'watering' ||
        item.type === 'fertilizer' ||
        item.type === 'treatment' ||
        item.type === 'note'
          ? item.type
          : 'note'
      return {
        id: asString(item.id) || `event-${Date.now()}`,
        type,
        date: asString(item.date),
        note: asString(item.note),
        imageUrl: optionalString(item.imageUrl),
        createdAt: asString(item.createdAt) || new Date().toISOString(),
      }
    })
    .filter((item) => item.date || item.note || item.imageUrl)
}

function normalizeIndividual(value: unknown): NfcIndividual | null {
  if (!isRecord(value)) return null
  const uid = normalizeNfcId(asString(value.uid))
  if (!uid) return null
  const now = new Date().toISOString()

  return {
    uid,
    individualCode: asString(value.individualCode) || uid,
    plantSlug: optionalString(value.plantSlug),
    cultivarName: asString(value.cultivarName) || asString(value.tradeName) || asString(value.scientificName) || uid,
    scientificName: optionalString(value.scientificName),
    tradeName: optionalString(value.tradeName),
    sourceType: normalizeSourceType(value.sourceType),
    stockStatus: normalizeStockStatus(value.stockStatus),
    acquiredAt: optionalString(value.acquiredAt),
    acclimationStartedAt: optionalString(value.acclimationStartedAt),
    acclimationCompletedAt: optionalString(value.acclimationCompletedAt),
    saleAt: optionalString(value.saleAt),
    ownerName: optionalString(value.ownerName),
    ownerEmail: optionalString(value.ownerEmail),
    ownerPhone: optionalString(value.ownerPhone),
    ownerNickname: optionalString(value.ownerNickname),
    ownerAdoptedAt: optionalString(value.ownerAdoptedAt),
    lastRepottedAt: optionalString(value.lastRepottedAt),
    growthStatus: optionalString(value.growthStatus),
    publicNote: optionalString(value.publicNote),
    privateNote: optionalString(value.privateNote),
    recoveryCode: optionalString(value.recoveryCode),
    replacementOfUid: optionalString(value.replacementOfUid),
    careEvents: normalizeCareEvents(value.careEvents),
    createdAt: asString(value.createdAt) || now,
    updatedAt: asString(value.updatedAt) || now,
  }
}

async function readIndividualsFromStorage() {
  const client = getServiceClient()
  if (!client) return []

  const { data, error } = await client.storage.from(nfcBucket).download(individualsPath)
  if (error || !data) return []

  try {
    const parsed = JSON.parse(await data.text())
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeIndividual).filter((item): item is NfcIndividual => Boolean(item))
  } catch {
    return []
  }
}

async function writeIndividualsToStorage(individuals: NfcIndividual[]) {
  const bucketError = await ensureNfcBucket()
  if (bucketError) return bucketError

  const client = getServiceClient()
  if (!client) return 'NFC storage is not configured.'

  const { error } = await client.storage.from(nfcBucket).upload(individualsPath, JSON.stringify(individuals, null, 2), {
    contentType: 'application/json; charset=utf-8',
    upsert: true,
  })
  return error?.message ?? null
}

async function upsertLegacyItem(row: NfcIndividual) {
  const client = getServiceClient()
  if (!client) return null

  const legacyRow: NfcItem = {
    id: row.uid,
    uid: row.uid,
    plant_id: row.uid,
    name: row.cultivarName,
    name_en: row.scientificName,
    scientific_name: row.scientificName,
    name_jp: row.cultivarName,
    trade_name: row.tradeName,
    slug: row.plantSlug,
  }

  const { error } = await client.from('items').upsert(legacyRow, { onConflict: 'id' })
  return error?.message ?? null
}

export async function listNfcIndividuals() {
  const rows = await readIndividualsFromStorage()
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function getNfcIndividual(uid: string) {
  const normalizedUid = normalizeNfcId(uid)
  const rows = await listNfcIndividuals()
  return rows.find((row) => row.uid === normalizedUid) ?? null
}

export async function saveNfcIndividual(input: NfcIndividualInput) {
  const uid = normalizeNfcId(input.uid)
  if (!uid) return { ok: false, message: 'NFC UIDを入力してください。' }

  const currentRows = await listNfcIndividuals()
  const current = currentRows.find((row) => row.uid === uid)
  const now = new Date().toISOString()
  const nextRow = normalizeIndividual({
    ...current,
    ...input,
    uid,
    replacementOfUid: input.replacementOfUid ? normalizeNfcId(input.replacementOfUid) : undefined,
    individualCode: input.individualCode || current?.individualCode || uid,
    careEvents: current?.careEvents ?? [],
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  })

  if (!nextRow) return { ok: false, message: '個体データを保存できませんでした。' }

  const nextRows = [nextRow, ...currentRows.filter((row) => row.uid !== uid)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const storageError = await writeIndividualsToStorage(nextRows)
  if (storageError) return { ok: false, message: storageError }

  const legacyError = await upsertLegacyItem(nextRow)

  return {
    ok: true,
    item: nextRow,
    individuals: nextRows,
    message: legacyError ? `個体台帳は保存しました。旧items同期のみ失敗: ${legacyError}` : '保存しました。',
  }
}

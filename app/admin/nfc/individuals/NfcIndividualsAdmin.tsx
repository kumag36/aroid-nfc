'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Plant } from '@/lib/dictionary-data'
import type { NfcIndividual, NfcIndividualInput, NfcSourceType, NfcStockStatus } from '@/lib/nfc-individual-storage'
import { getCanonicalNfcUrl, normalizeNfcId } from '@/lib/nfc-items'

type Props = {
  plants: Plant[]
  initialIndividuals: NfcIndividual[]
  storageReady: boolean
  initialUid?: string
}

type FormState = {
  uid: string
  individualCode: string
  plantSlug: string
  cultivarName: string
  scientificName: string
  tradeName: string
  sourceType: NfcSourceType
  stockStatus: NfcStockStatus
  acquiredAt: string
  acclimationStartedAt: string
  acclimationCompletedAt: string
  saleAt: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  ownerNickname: string
  ownerAdoptedAt: string
  lastRepottedAt: string
  growthStatus: string
  publicNote: string
  privateNote: string
  recoveryCode: string
  replacementOfUid: string
}

const emptyForm: FormState = {
  uid: '',
  individualCode: '',
  plantSlug: '',
  cultivarName: '',
  scientificName: '',
  tradeName: '',
  sourceType: 'unknown',
  stockStatus: 'draft',
  acquiredAt: '',
  acclimationStartedAt: '',
  acclimationCompletedAt: '',
  saleAt: '',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  ownerNickname: '',
  ownerAdoptedAt: '',
  lastRepottedAt: '',
  growthStatus: '',
  publicNote: '',
  privateNote: '',
  recoveryCode: '',
  replacementOfUid: '',
}

function toForm(row: NfcIndividual): FormState {
  return {
    uid: row.uid,
    individualCode: row.individualCode,
    plantSlug: row.plantSlug ?? '',
    cultivarName: row.cultivarName,
    scientificName: row.scientificName ?? '',
    tradeName: row.tradeName ?? '',
    sourceType: row.sourceType,
    stockStatus: row.stockStatus,
    acquiredAt: row.acquiredAt ?? '',
    acclimationStartedAt: row.acclimationStartedAt ?? '',
    acclimationCompletedAt: row.acclimationCompletedAt ?? '',
    saleAt: row.saleAt ?? '',
    ownerName: row.ownerName ?? '',
    ownerEmail: row.ownerEmail ?? '',
    ownerPhone: row.ownerPhone ?? '',
    ownerNickname: row.ownerNickname ?? '',
    ownerAdoptedAt: row.ownerAdoptedAt ?? '',
    lastRepottedAt: row.lastRepottedAt ?? '',
    growthStatus: row.growthStatus ?? '',
    publicNote: row.publicNote ?? '',
    privateNote: row.privateNote ?? '',
    recoveryCode: row.recoveryCode ?? '',
    replacementOfUid: row.replacementOfUid ?? '',
  }
}

function compactPayload(form: FormState): NfcIndividualInput {
  return Object.fromEntries(
    Object.entries({
      ...form,
      uid: normalizeNfcId(form.uid),
      replacementOfUid: form.replacementOfUid ? normalizeNfcId(form.replacementOfUid) : '',
    }).map(([key, value]) => [key, typeof value === 'string' ? value.trim() || undefined : value]),
  ) as NfcIndividualInput
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-bold">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function NfcIndividualsAdmin({ plants, initialIndividuals, storageReady, initialUid = '' }: Props) {
  const [individuals, setIndividuals] = useState(initialIndividuals)
  const [form, setForm] = useState<FormState>(() => {
    const normalizedUid = normalizeNfcId(initialUid)
    const existing = initialIndividuals.find((row) => row.uid === normalizedUid)
    return existing ? toForm(existing) : { ...emptyForm, uid: normalizedUid, individualCode: normalizedUid }
  })
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [query, setQuery] = useState('')

  const visibleIndividuals = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return individuals
    return individuals.filter((row) =>
      [row.uid, row.individualCode, row.cultivarName, row.scientificName, row.tradeName, row.ownerName, row.ownerEmail, row.ownerNickname]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    )
  }, [individuals, query])

  const selectedPlant = plants.find((plant) => plant.slug === form.plantSlug)

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function applyPlant(slug: string) {
    const plant = plants.find((item) => item.slug === slug)
    setForm((current) => ({
      ...current,
      plantSlug: slug,
      cultivarName: plant?.tradeName || plant?.displayName || current.cultivarName,
      scientificName: plant?.displayName || current.scientificName,
      tradeName: plant?.tradeName || current.tradeName,
    }))
  }

  async function saveForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')

    const response = await fetch('/api/nfc/individuals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compactPayload(form)),
    })
    const result = await response.json()

    if (!response.ok || !result.ok) {
      setMessage(result.message ?? '保存できませんでした。')
      setIsSaving(false)
      return
    }

    setIndividuals(result.individuals ?? [])
    setForm(toForm(result.item))
    setMessage(result.message ?? '保存しました。')
    setIsSaving(false)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="zmk-admin-card p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="zmk-eyebrow text-[10px]">INDIVIDUAL FORM</p>
            <h2 className="mt-1 text-xl font-black">個体登録・更新</h2>
          </div>
          <button type="button" className="zmk-admin-link justify-center px-4 py-2 text-sm" onClick={() => setForm(emptyForm)}>
            新規入力
          </button>
        </div>

        {!storageReady ? (
          <div className="zmk-admin-alert mb-4 p-4 text-sm font-bold">Supabase保存先が未設定です。SUPABASE_SERVICE_ROLE_KEY と Storage bucket nfc を確認してください。</div>
        ) : null}
        {message ? <div className="zmk-admin-alert mb-4 p-4 text-sm font-bold">{message}</div> : null}

        <form onSubmit={saveForm} className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="NFC UID">
              <input className="zmk-admin-input" value={form.uid} onChange={(event) => updateField('uid', event.target.value.toUpperCase())} placeholder="ZMK-000001" required />
            </Field>
            <Field label="個体管理番号">
              <input className="zmk-admin-input" value={form.individualCode} onChange={(event) => updateField('individualCode', event.target.value)} placeholder="未入力ならUIDを使用" />
            </Field>
          </div>

          <Field label="図鑑品種">
            <select className="zmk-admin-input" value={form.plantSlug} onChange={(event) => applyPlant(event.target.value)}>
              <option value="">未選択</option>
              {plants.map((plant) => (
                <option key={plant.slug} value={plant.slug}>
                  {plant.tradeName || plant.displayName}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="品種名・表示名">
              <input className="zmk-admin-input" value={form.cultivarName} onChange={(event) => updateField('cultivarName', event.target.value)} required />
            </Field>
            <Field label="学名">
              <input className="zmk-admin-input" value={form.scientificName} onChange={(event) => updateField('scientificName', event.target.value)} />
            </Field>
            <Field label="流通名">
              <input className="zmk-admin-input" value={form.tradeName} onChange={(event) => updateField('tradeName', event.target.value)} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="由来">
              <select className="zmk-admin-input" value={form.sourceType} onChange={(event) => updateField('sourceType', event.target.value as NfcSourceType)}>
                <option value="unknown">未設定</option>
                <option value="import">輸入</option>
                <option value="domestic">国内入荷</option>
                <option value="tc">TC</option>
                <option value="division">株分け</option>
                <option value="seedling">実生</option>
              </select>
            </Field>
            <Field label="販売状態">
              <select className="zmk-admin-input" value={form.stockStatus} onChange={(event) => updateField('stockStatus', event.target.value as NfcStockStatus)}>
                <option value="draft">下書き</option>
                <option value="in_stock">在庫</option>
                <option value="reserved">取置き</option>
                <option value="sold">販売済み</option>
                <option value="archived">保管終了</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="入荷日">
              <input type="date" className="zmk-admin-input" value={form.acquiredAt} onChange={(event) => updateField('acquiredAt', event.target.value)} />
            </Field>
            <Field label="順化開始日">
              <input type="date" className="zmk-admin-input" value={form.acclimationStartedAt} onChange={(event) => updateField('acclimationStartedAt', event.target.value)} />
            </Field>
            <Field label="順化完了日">
              <input type="date" className="zmk-admin-input" value={form.acclimationCompletedAt} onChange={(event) => updateField('acclimationCompletedAt', event.target.value)} />
            </Field>
            <Field label="販売日">
              <input type="date" className="zmk-admin-input" value={form.saleAt} onChange={(event) => updateField('saleAt', event.target.value)} />
            </Field>
          </div>

          <div className="zmk-admin-panel grid gap-3 p-4">
            <p className="zmk-eyebrow text-[10px]">OWNER RECOVERY</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="顧客名"><input className="zmk-admin-input" value={form.ownerName} onChange={(event) => updateField('ownerName', event.target.value)} /></Field>
              <Field label="メール"><input type="email" className="zmk-admin-input" value={form.ownerEmail} onChange={(event) => updateField('ownerEmail', event.target.value)} /></Field>
              <Field label="電話"><input className="zmk-admin-input" value={form.ownerPhone} onChange={(event) => updateField('ownerPhone', event.target.value)} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="顧客側ニックネーム"><input className="zmk-admin-input" value={form.ownerNickname} onChange={(event) => updateField('ownerNickname', event.target.value)} /></Field>
              <Field label="お迎え日"><input type="date" className="zmk-admin-input" value={form.ownerAdoptedAt} onChange={(event) => updateField('ownerAdoptedAt', event.target.value)} /></Field>
              <Field label="最終鉢増し日"><input type="date" className="zmk-admin-input" value={form.lastRepottedAt} onChange={(event) => updateField('lastRepottedAt', event.target.value)} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="復旧コード"><input className="zmk-admin-input" value={form.recoveryCode} onChange={(event) => updateField('recoveryCode', event.target.value)} placeholder="タグ故障・再発行時の本人確認用" /></Field>
              <Field label="交換元UID"><input className="zmk-admin-input" value={form.replacementOfUid} onChange={(event) => updateField('replacementOfUid', event.target.value.toUpperCase())} /></Field>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="公開メモ"><textarea className="zmk-admin-input min-h-28" value={form.publicNote} onChange={(event) => updateField('publicNote', event.target.value)} /></Field>
            <Field label="管理メモ"><textarea className="zmk-admin-input min-h-28" value={form.privateNote} onChange={(event) => updateField('privateNote', event.target.value)} /></Field>
          </div>

          <Field label="生育状況">
            <textarea className="zmk-admin-input min-h-24" value={form.growthStatus} onChange={(event) => updateField('growthStatus', event.target.value)} />
          </Field>

          <div className="grid gap-2 sm:grid-cols-3">
            <button className="zmk-button zmk-button-primary" disabled={isSaving || !storageReady} type="submit">
              {isSaving ? '保存中' : '保存'}
            </button>
            <Link href={`/admin/nfc/rewrite?id=${encodeURIComponent(normalizeNfcId(form.uid || 'ZMK-000001'))}`} className="zmk-button">書き込みへ</Link>
            <Link href={`/i/${encodeURIComponent(normalizeNfcId(form.uid || 'ZMK-000001'))}`} className="zmk-button">個体ページ確認</Link>
          </div>

          {form.uid ? <p className="zmk-admin-code break-all p-3 text-xs font-bold">{getCanonicalNfcUrl(form.uid)}</p> : null}
          {selectedPlant ? <p className="zmk-admin-muted text-xs leading-5">選択中: {selectedPlant.displayName}</p> : null}
        </form>
      </section>

      <aside className="space-y-4">
        <section className="zmk-admin-card p-4">
          <p className="zmk-eyebrow text-[10px]">LIST</p>
          <h2 className="mt-1 text-xl font-black">登録個体</h2>
          <input className="zmk-admin-input mt-3" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="UID、品種、顧客で検索" />
          <div className="mt-4 max-h-[38rem] space-y-2 overflow-y-auto pr-1">
            {visibleIndividuals.length ? (
              visibleIndividuals.map((row) => (
                <button key={row.uid} type="button" className="w-full rounded-[8px] border border-[var(--zmk-border)] bg-[var(--zmk-bg-soft)] p-3 text-left" onClick={() => setForm(toForm(row))}>
                  <span className="block text-sm font-black">{row.cultivarName}</span>
                  <span className="zmk-admin-muted mt-1 block text-xs">{row.uid} / {row.stockStatus}</span>
                  {row.ownerName || row.ownerNickname ? <span className="zmk-admin-muted mt-1 block text-xs">Owner: {row.ownerNickname || row.ownerName}</span> : null}
                </button>
              ))
            ) : (
              <p className="zmk-admin-muted text-sm">登録個体はありません。</p>
            )}
          </div>
        </section>

        <section className="zmk-admin-alert p-4">
          <p className="zmk-eyebrow text-[10px]">DESIGN RULE</p>
          <p className="mt-2 text-sm font-bold leading-6">NFCタグはUIDだけを書き込み、データはサーバーに置きます。タグ故障時は顧客情報・復旧コード・交換元UIDで再発行します。</p>
        </section>
      </aside>
    </div>
  )
}

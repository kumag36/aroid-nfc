'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type VerifyResponse = {
  uid: string
  nfc?: {
    status: 'registered' | 'not_registered' | 'error'
    code: string
    message: string
    item?: {
      id?: string
      name_en?: string | null
      name_jp?: string | null
      slug?: string | null
    } | null
  } | null
  urls?: {
    individual?: string
    registration?: string
    writeUrl?: string
  } | null
}

const defaultUid = 'ZMK-000001'

export default function NfcVerifyConsole() {
  const [uid, setUid] = useState(defaultUid)
  const [result, setResult] = useState<VerifyResponse | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [message, setMessage] = useState('NFCタグに書き込むURLを準備します。')

  const normalizedUid = useMemo(() => uid.trim().toUpperCase(), [uid])
  const writeUrl = `https://zamakuri.jp/i/${encodeURIComponent(normalizedUid || defaultUid)}`

  async function verify() {
    if (!normalizedUid) return
    setIsChecking(true)
    setMessage('確認中です。')
    try {
      const response = await fetch(`/api/nfc/verify?uid=${encodeURIComponent(normalizedUid)}`, { cache: 'no-store' })
      const data = (await response.json()) as VerifyResponse
      setResult(data)
      setMessage(data.nfc?.message || '確認しました。')
    } catch {
      setMessage('確認に失敗しました。通信状態を確認してください。')
    } finally {
      setIsChecking(false)
    }
  }

  async function copyWriteUrl() {
    await navigator.clipboard.writeText(writeUrl)
    setMessage('URLをコピーしました。NFC ToolsのURLレコードへ貼り付けてください。')
  }

  return (
    <div className="grid gap-5">
      <section className="zmk-admin-card p-4 sm:p-5">
        <p className="zmk-eyebrow mb-3 text-[11px]">NFC CHECK</p>
        <label className="block">
          <span className="zmk-admin-label mb-2 block">NFC ID</span>
          <input
            value={uid}
            onChange={(event) => setUid(event.target.value)}
            className="zmk-admin-input w-full text-base font-semibold"
            placeholder="ZMK-000001"
          />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={verify} disabled={isChecking} className="zmk-button zmk-button-primary min-h-12">
            {isChecking ? '確認中' : '確認'}
          </button>
          <button type="button" onClick={copyWriteUrl} className="zmk-button min-h-12">
            URLコピー
          </button>
        </div>
        <p className="zmk-admin-muted mt-4 text-sm leading-7">{message}</p>
      </section>

      <section className="zmk-admin-card p-4 sm:p-5">
        <p className="zmk-eyebrow mb-3 text-[11px]">WRITE URL</p>
        <p className="zmk-admin-code break-all p-3 text-sm font-semibold">{writeUrl}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/admin/nfc/rewrite?id=${encodeURIComponent(normalizedUid || defaultUid)}`} className="zmk-button zmk-button-primary">
            書き込み画面へ
          </Link>
          <Link href={`/admin/items/new?id=${encodeURIComponent(normalizedUid || defaultUid)}`} className="zmk-button">
            登録画面へ
          </Link>
        </div>
      </section>

      {result ? (
        <section className="zmk-admin-card p-4 sm:p-5">
          <p className="zmk-eyebrow mb-3 text-[11px]">RESULT</p>
          <dl className="grid gap-2 text-sm text-[var(--zmk-ink)]">
            <div className="flex justify-between gap-4 border-b border-[var(--zmk-border)] pb-2">
              <dt>ID</dt>
              <dd className="font-semibold">{result.uid}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--zmk-border)] pb-2">
              <dt>状態</dt>
              <dd className="font-semibold">{result.nfc?.status || 'unknown'}</dd>
            </div>
            <div className="grid gap-1 border-b border-[var(--zmk-border)] pb-2">
              <dt>メッセージ</dt>
              <dd>{result.nfc?.message || '結果を取得しました。'}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </div>
  )
}

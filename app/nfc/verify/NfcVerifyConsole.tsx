'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type VerifyResponse = {
  uid: string
  nfc: null | {
    status: 'registered' | 'not_registered' | 'error'
    code: string
    message: string
    item: null | {
      id?: string
      name_en?: string | null
      name_jp?: string | null
      slug?: string | null
    }
  }
  urls: null | {
    individual: string
    legacy: string
    registration: string
    writeUrl: string
  }
  database: Record<
    string,
    {
      status: string
      label: string
      count: number
      detail: string
    }
  >
}

const defaultUid = 'ZMK-000001'

const initialDatabase = {
  dictionary: {
    status: 'ready',
    label: 'アロイド図鑑DB',
    count: 38,
    detail: '品種データ、詳細ページ、画像紐づけの土台を実装済みです。',
  },
  nfcItems: {
    status: 'connected',
    label: 'NFC個体管理DB',
    count: 0,
    detail: 'UID検証、個体ページ、未登録時の案内、登録申請導線を実装済みです。',
  },
  music: {
    status: 'ready',
    label: '音楽室DB',
    count: 8,
    detail: 'ローカルMP3、YouTube情報、アップロード曲を同じ音楽室に統合しています。',
  },
  museum: {
    status: 'ready',
    label: '美術館DB',
    count: 0,
    detail: '管理者アップロードとギャラリー表示を実装済みです。',
  },
}

const writeSteps = [
  '下のURLをコピーします。',
  'iPhoneでNFC Toolsを開きます。',
  'Write、Add a record、URL / URI の順に選びます。',
  'URLを貼り付けて Write を押します。',
  'iPhone上部をNFCタグに近づけ、完了表示まで動かさずに待ちます。',
  'タグを読み取り、個体ページが開くことを確認します。',
]

function statusLabel(status: string) {
  if (status === 'registered' || status === 'ready' || status === 'connected') return 'READY'
  if (status === 'not_registered') return 'UNREGISTERED'
  return 'CHECK'
}

export default function NfcVerifyConsole() {
  const [uid, setUid] = useState(defaultUid)
  const [result, setResult] = useState<VerifyResponse | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [writeStatus, setWriteStatus] = useState('NFC Toolsへ書き込むURLを準備しています。')

  const normalizedUid = useMemo(() => uid.trim().toUpperCase(), [uid])
  const writeUrl = useMemo(
    () => `https://zamakuri.jp/i/${encodeURIComponent(normalizedUid || defaultUid)}`,
    [normalizedUid],
  )

  async function verify() {
    if (!normalizedUid) return

    setIsChecking(true)
    try {
      const response = await fetch(`/api/nfc/verify?uid=${encodeURIComponent(normalizedUid)}`, {
        cache: 'no-store',
      })
      setResult((await response.json()) as VerifyResponse)
    } finally {
      setIsChecking(false)
    }
  }

  async function copyWriteUrl() {
    await navigator.clipboard.writeText(writeUrl)
    setWriteStatus('コピーしました。NFC ToolsのURL / URIレコードへ貼り付けてください。')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="border border-[#2c6a4b]/10 bg-white/88 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.26)] md:p-8">
        <p className="mb-5 text-xs font-semibold tracking-[0.28em] text-[#b89558]">NFC TOOLS LAB</p>
        <label className="block">
          <span className="mb-3 block text-sm leading-7 text-[#315244]/72">
            NFC ID
          </span>
          <input
            value={uid}
            onChange={(event) => setUid(event.target.value)}
            className="min-h-14 w-full border border-[#2c6a4b]/14 bg-[#020403] px-4 text-lg tracking-[0.12em] text-[#143326] outline-none transition focus:border-[#d9ffd8]/55"
            placeholder="ZMK-000001"
          />
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={verify}
            disabled={!normalizedUid || isChecking}
            className="inline-flex min-h-12 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isChecking ? 'CHECKING' : 'VERIFY'}
          </button>
          <Link
            href={`/i/${encodeURIComponent(normalizedUid || defaultUid)}`}
            className="inline-flex min-h-12 items-center justify-center border border-[#2c6a4b]/22 px-7 text-sm font-semibold tracking-[0.18em] text-[#143326] transition duration-300 hover:-translate-y-0.5 hover:border-[#d9ffd8]/55"
          >
            OPEN PAGE
          </Link>
        </div>

        <div className="mt-8 border border-[#2c6a4b]/10 bg-[#fffaf0]/5 p-5">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">WRITE THIS URL TO NFC TAG</p>
          <p className="mt-4 break-all border border-[#2c6a4b]/10 bg-[#020403] px-4 py-3 text-sm leading-7 text-[#315244]/78">
            {writeUrl}
          </p>
          <p className="mt-4 border-l border-[#b89558]/55 pl-4 text-xs leading-6 text-[#315244]/68">
            iPhoneのSafariではWebページから直接NFCを書き込めないため、NFC ToolsでURLレコードとして書き込みます。タグにはこの短いURLだけを入れ、個体情報はWeb側のDBで管理します。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyWriteUrl}
              className="inline-flex min-h-12 items-center justify-center border border-[#2c6a4b]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#143326] transition hover:border-[#d9ffd8]/55"
            >
              COPY URL
            </button>
            <a
              href="https://apps.apple.com/app/nfc-tools/id1252962749"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center border border-[#b89558] bg-[#b89558] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d] transition hover:-translate-y-0.5"
            >
              OPEN NFC TOOLS
            </a>
          </div>
          <p className="mt-4 text-xs leading-6 text-[#315244]/62">{writeStatus}</p>
          <ol className="mt-5 grid gap-3 text-[13px] leading-7 text-[#315244]/76">
            {writeSteps.map((step, index) => (
              <li key={step} className="border-l border-[#d9ffd8]/30 pl-4">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 border border-[#2c6a4b]/10 bg-[#fffaf0]/5 p-5">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">VERIFY RESULT</p>
          {!result?.nfc ? (
            <p className="mt-4 text-[15px] leading-8 text-[#315244]/72">
              UIDを入力して検証すると、登録済み・未登録・DB接続状態を確認できます。
            </p>
          ) : (
            <div className="mt-5 grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-[#d9ffd8]/30 bg-[#d9ffd8]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#d9ffd8]">
                  {statusLabel(result.nfc.status)}
                </span>
                <span className="text-sm tracking-[0.12em] text-[#315244]/68">{result.nfc.code}</span>
              </div>
              <p className="text-[15px] leading-8 text-[#315244]/78">{result.nfc.message}</p>
              {result.nfc.item && (
                <div className="border-l border-[#d9ffd8]/35 pl-4 text-[15px] leading-8 text-[#143326]">
                  <p>{result.nfc.item.name_en || result.nfc.item.name_jp || result.uid}</p>
                  {result.nfc.item.name_jp && <p className="text-[#315244]/70">Trade name: {result.nfc.item.name_jp}</p>}
                </div>
              )}
              {result.urls && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href={result.urls.individual} className="text-sm font-semibold tracking-[0.14em] text-[#d9ffd8] underline underline-offset-4">
                    /i/{result.uid}
                  </Link>
                  <Link href={result.urls.registration} className="text-sm font-semibold tracking-[0.14em] text-[#d9ffd8] underline underline-offset-4">
                    registration
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <aside className="grid gap-3">
        {Object.entries(result?.database ?? initialDatabase).map(([key, value]) => (
          <article key={key} className="border border-[#2c6a4b]/10 bg-white/86 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#b89558]">{value.label}</p>
              <span className="text-[11px] tracking-[0.14em] text-[#d9ffd8]/72">{statusLabel(value.status)}</span>
            </div>
            <p className="text-3xl font-medium text-[#143326]">{value.count}</p>
            <p className="mt-4 text-[13px] leading-7 text-[#315244]/70">{value.detail}</p>
          </article>
        ))}
      </aside>
    </div>
  )
}

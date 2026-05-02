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
    label: 'Aroid dictionary DB',
    count: 38,
    detail: 'Dictionary entries and detail pages are implemented.',
  },
  nfcItems: {
    status: 'connected',
    label: 'NFC individual DB',
    count: 0,
    detail: 'UID verification, individual pages, unregistered guidance, and registration flow are implemented.',
  },
  music: {
    status: 'ready',
    label: 'Music room DB',
    count: 8,
    detail: 'Local MP3, YouTube, and uploaded tracks are shown in one room.',
  },
  museum: {
    status: 'ready',
    label: 'Museum DB',
    count: 0,
    detail: 'Admin upload and gallery display are implemented.',
  },
}

const writeSteps = [
  'Copy the URL below.',
  'Open NFC Tools on iPhone.',
  'Tap Write, Add a record, then URL / URI.',
  'Paste the URL and tap Write.',
  'Hold the top of the iPhone near the NFC tag until writing completes.',
  'Read the tag with iPhone and confirm that the individual page opens.',
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
  const [writeStatus, setWriteStatus] = useState('NFC Tools write URL is ready.')

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
    setWriteStatus('Copied. Paste this into NFC Tools as a URL / URI record.')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="border border-[#fffaf0]/10 bg-[#07120d]/88 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.26)] md:p-8">
        <p className="mb-5 text-xs font-semibold tracking-[0.28em] text-[#b89558]">NFC TOOLS LAB</p>
        <label className="block">
          <span className="mb-3 block text-sm leading-7 text-[#d8d0bf]/72">
            NFC ID
          </span>
          <input
            value={uid}
            onChange={(event) => setUid(event.target.value)}
            className="min-h-14 w-full border border-[#fffaf0]/14 bg-[#020403] px-4 text-lg tracking-[0.12em] text-[#fffaf0] outline-none transition focus:border-[#d9ffd8]/55"
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
            className="inline-flex min-h-12 items-center justify-center border border-[#fffaf0]/22 px-7 text-sm font-semibold tracking-[0.18em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#d9ffd8]/55"
          >
            OPEN PAGE
          </Link>
        </div>

        <div className="mt-8 border border-[#fffaf0]/10 bg-[#fffaf0]/5 p-5">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">WRITE THIS URL TO NFC TAG</p>
          <p className="mt-4 break-all border border-[#fffaf0]/10 bg-[#020403] px-4 py-3 text-sm leading-7 text-[#d8d0bf]/78">
            {writeUrl}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyWriteUrl}
              className="inline-flex min-h-12 items-center justify-center border border-[#fffaf0]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition hover:border-[#d9ffd8]/55"
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
          <p className="mt-4 text-xs leading-6 text-[#d8d0bf]/62">{writeStatus}</p>
          <ol className="mt-5 grid gap-3 text-[13px] leading-7 text-[#d8d0bf]/76">
            {writeSteps.map((step, index) => (
              <li key={step} className="border-l border-[#d9ffd8]/30 pl-4">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 border border-[#fffaf0]/10 bg-[#fffaf0]/5 p-5">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">VERIFY RESULT</p>
          {!result?.nfc ? (
            <p className="mt-4 text-[15px] leading-8 text-[#d8d0bf]/72">
              Enter a UID and run verification before writing tags in bulk.
            </p>
          ) : (
            <div className="mt-5 grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-[#d9ffd8]/30 bg-[#d9ffd8]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#d9ffd8]">
                  {statusLabel(result.nfc.status)}
                </span>
                <span className="text-sm tracking-[0.12em] text-[#d8d0bf]/68">{result.nfc.code}</span>
              </div>
              <p className="text-[15px] leading-8 text-[#d8d0bf]/78">{result.nfc.message}</p>
              {result.nfc.item && (
                <div className="border-l border-[#d9ffd8]/35 pl-4 text-[15px] leading-8 text-[#fffaf0]">
                  <p>{result.nfc.item.name_en || result.nfc.item.name_jp || result.uid}</p>
                  {result.nfc.item.name_jp && <p className="text-[#d8d0bf]/70">Trade name: {result.nfc.item.name_jp}</p>}
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
          <article key={key} className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#b89558]">{value.label}</p>
              <span className="text-[11px] tracking-[0.14em] text-[#d9ffd8]/72">{statusLabel(value.status)}</span>
            </div>
            <p className="text-3xl font-medium text-[#fffaf0]">{value.count}</p>
            <p className="mt-4 text-[13px] leading-7 text-[#d8d0bf]/70">{value.detail}</p>
          </article>
        ))}
      </aside>
    </div>
  )
}

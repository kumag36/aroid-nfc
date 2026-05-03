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
const shortcutName = 'ZAMAKURI NFC Writer'

const initialDatabase = {
  dictionary: {
    status: 'ready',
    label: 'アロイド図鑑DB',
    count: 39,
    detail: '品種データ、詳細ページ、代表画像の紐づけを管理しています。',
  },
  nfcItems: {
    status: 'connected',
    label: 'NFC個体管理DB',
    count: 0,
    detail: 'UID検証、個体ページ、未登録時の登録導線を確認します。',
  },
  music: {
    status: 'ready',
    label: '音楽室DB',
    count: 4,
    detail: 'ローカルMP3、YouTubeメタ情報、アップロード導線を統合しています。',
  },
  museum: {
    status: 'ready',
    label: '漫画室DB',
    count: 0,
    detail: '管理アップロードとギャラリー表示を確認します。',
  },
}

const writeSteps = [
  'この画面で植物IDを確認し、書き込みURLをコピーします。',
  'iPhoneでNFC Toolsを開きます。',
  'Write → Add a record → URL / URI を選びます。',
  'コピーしたURLを貼り付け、OK → Write を押します。',
  'iPhone上部をNFCタグに近づけ、完了表示まで待ちます。',
  'タグを読み取り、個体ページまたは未登録ガイドが開くことを確認します。',
]

const shortcutSteps = [
  'ショートカットAppで「+」を押して新規作成します。',
  `名前を「${shortcutName}」にします。`,
  'アクション「URL」を追加し、この画面の書き込みURLを入れます。',
  'アクション「クリップボードにコピー」を追加します。',
  'アクション「Appを開く」で NFC Tools を選びます。',
  '以後はこのショートカットを起動すると、URLコピー後にNFC Toolsへ移れます。',
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
    setWriteStatus('コピーしました。NFC Tools の URL / URI レコードへ貼り付けてください。')
  }

  async function copyShortcutRecipe() {
    await navigator.clipboard.writeText(
      [
        `Shortcut name: ${shortcutName}`,
        `Write URL: ${writeUrl}`,
        '',
        'Actions:',
        '1. URL',
        `   ${writeUrl}`,
        '2. Copy to Clipboard',
        '3. Open App',
        '   NFC Tools',
      ].join('\n'),
    )
    setWriteStatus('ショートカット作成メモをコピーしました。iPhoneのショートカットAppに沿って組んでください。')
  }

  async function copyShortcutLauncher() {
    const launcherUrl = `shortcuts://run-shortcut?name=${encodeURIComponent(shortcutName)}&input=text&text=${encodeURIComponent(writeUrl)}`
    await navigator.clipboard.writeText(launcherUrl)
    setWriteStatus('ショートカット起動URLをコピーしました。ショートカット作成後にChromeから起動確認できます。')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="border border-[#2c6a4b]/10 bg-white/88 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.14)] dark:border-[#d9ffd8]/12 dark:bg-[#10291e]/82 md:p-8">
        <p className="zmk-eyebrow mb-5 text-xs">IPHONE NFC WRITE ASSIST</p>
        <label className="block">
          <span className="mb-3 block text-sm leading-7 text-[#315244]/72 dark:text-[#d9ffd8]/72">
            NFC ID
          </span>
          <input
            value={uid}
            onChange={(event) => setUid(event.target.value)}
            className="min-h-14 w-full border border-[#2c6a4b]/14 bg-white px-4 text-lg tracking-[0.12em] text-[#143326] outline-none transition focus:border-[#2c6a4b]/55 dark:border-[#d9ffd8]/16 dark:bg-[#07110c] dark:text-[#f7fbf1] dark:focus:border-[#d9ffd8]/55"
            placeholder="ZMK-000001"
          />
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={verify}
            disabled={!normalizedUid || isChecking}
            className="zmk-button zmk-button-primary"
          >
            {isChecking ? 'CHECKING' : 'VERIFY'}
          </button>
          <Link href={`/i/${encodeURIComponent(normalizedUid || defaultUid)}`} className="zmk-button">
            OPEN PAGE
          </Link>
        </div>

        <div className="mt-8 border border-[#2c6a4b]/10 bg-[#fffaf0]/55 p-5 dark:border-[#d9ffd8]/12 dark:bg-[#07110c]/44">
          <p className="zmk-eyebrow text-[11px]">WRITE THIS URL TO NFC TAG</p>
          <p className="mt-4 break-all border border-[#2c6a4b]/10 bg-white px-4 py-3 text-sm leading-7 text-[#315244]/78 dark:border-[#d9ffd8]/12 dark:bg-[#020403] dark:text-[#d9ffd8]/78">
            {writeUrl}
          </p>
          <p className="mt-4 border-l border-[#b89558]/55 pl-4 text-xs leading-6 text-[#315244]/68 dark:text-[#d9ffd8]/68">
            iPhone Chromeからでも、タグへ書き込む内容はこの短いURLだけです。個体情報はタグ内に持たせず、Web側DBで管理します。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={copyWriteUrl} className="zmk-button">
              COPY URL
            </button>
            <a
              href="https://apps.apple.com/app/nfc-tools/id1252962749"
              target="_blank"
              rel="noreferrer"
              className="zmk-button zmk-button-primary"
            >
              OPEN NFC TOOLS
            </a>
          </div>
          <p className="mt-4 text-xs leading-6 text-[#315244]/62 dark:text-[#d9ffd8]/62">{writeStatus}</p>
          <ol className="mt-5 grid gap-3 text-[13px] leading-7 text-[#315244]/76 dark:text-[#d9ffd8]/76">
            {writeSteps.map((step, index) => (
              <li key={step} className="border-l border-[#2c6a4b]/22 pl-4 dark:border-[#d9ffd8]/30">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 border border-[#2c6a4b]/10 bg-white/78 p-5 dark:border-[#d9ffd8]/12 dark:bg-[#07110c]/44">
          <p className="zmk-eyebrow text-[11px]">SHORTCUT BUILDER</p>
          <h3 className="mt-4 text-2xl text-[#143326] dark:text-[#f7fbf1]">ChromeからNFC Toolsへ渡す下準備</h3>
          <p className="zmk-muted mt-4 text-[13px] leading-7">
            iOSショートカット単体ではNFCタグへ直接URLを書き込めないため、ショートカットでは「URLをコピーしてNFC Toolsを開く」ところまで自動化します。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={copyShortcutRecipe} className="zmk-button">
              COPY RECIPE
            </button>
            <button type="button" onClick={copyShortcutLauncher} className="zmk-button">
              COPY LAUNCH URL
            </button>
            <a href="shortcuts://" className="zmk-button zmk-button-primary">
              OPEN SHORTCUTS
            </a>
          </div>
          <ol className="mt-5 grid gap-3 text-[13px] leading-7 text-[#315244]/76 dark:text-[#d9ffd8]/76">
            {shortcutSteps.map((step, index) => (
              <li key={step} className="border-l border-[#2c6a4b]/22 pl-4 dark:border-[#d9ffd8]/30">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 border border-[#2c6a4b]/10 bg-[#fffaf0]/55 p-5 dark:border-[#d9ffd8]/12 dark:bg-[#07110c]/44">
          <p className="zmk-eyebrow text-[11px]">VERIFY RESULT</p>
          {!result?.nfc ? (
            <p className="mt-4 text-[15px] leading-8 text-[#315244]/72 dark:text-[#d9ffd8]/72">
              UIDを入力して検証すると、登録済み・未登録・DB接続状態を確認できます。
            </p>
          ) : (
            <div className="mt-5 grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="zmk-ui border border-[#2c6a4b]/30 bg-[#d9ffd8]/26 px-3 py-1 text-[11px] text-[#143326] dark:border-[#d9ffd8]/30 dark:bg-[#d9ffd8]/10 dark:text-[#d9ffd8]">
                  {statusLabel(result.nfc.status)}
                </span>
                <span className="zmk-ui text-sm tracking-[0.12em] text-[#315244]/68 dark:text-[#d9ffd8]/68">{result.nfc.code}</span>
              </div>
              <p className="text-[15px] leading-8 text-[#315244]/78 dark:text-[#d9ffd8]/78">{result.nfc.message}</p>
              {result.nfc.item && (
                <div className="border-l border-[#2c6a4b]/35 pl-4 text-[15px] leading-8 text-[#143326] dark:border-[#d9ffd8]/35 dark:text-[#f7fbf1]">
                  <p>{result.nfc.item.name_en || result.nfc.item.name_jp || result.uid}</p>
                  {result.nfc.item.name_jp && <p className="text-[#315244]/70 dark:text-[#d9ffd8]/70">Trade name: {result.nfc.item.name_jp}</p>}
                </div>
              )}
              {result.urls && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href={result.urls.individual} className="zmk-ui text-sm text-[#2c6a4b] underline underline-offset-4 dark:text-[#d9ffd8]">
                    /i/{result.uid}
                  </Link>
                  <Link href={result.urls.registration} className="zmk-ui text-sm text-[#2c6a4b] underline underline-offset-4 dark:text-[#d9ffd8]">
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
          <article key={key} className="border border-[#2c6a4b]/10 bg-white/86 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.10)] dark:border-[#d9ffd8]/12 dark:bg-[#10291e]/82">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="zmk-eyebrow text-[11px]">{value.label}</p>
              <span className="zmk-ui text-[11px] tracking-[0.14em] text-[#315244]/72 dark:text-[#d9ffd8]/72">{statusLabel(value.status)}</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-[#143326] dark:text-[#f7fbf1]">{value.count}</p>
            <p className="mt-4 text-[13px] leading-7 text-[#315244]/70 dark:text-[#d9ffd8]/70">{value.detail}</p>
          </article>
        ))}
      </aside>
    </div>
  )
}

import Link from 'next/link'
import { fetchNfcItem, getCanonicalNfcUrl, normalizeNfcId } from '@/lib/nfc-items'
import CopyButton from '@/app/nfc/rewrite/CopyButton'

type PageProps = { searchParams?: Promise<{ id?: string }> }

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'NFC書き込み | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default async function AdminNfcRewritePage({ searchParams }: PageProps) {
  const params = await searchParams
  const id = normalizeNfcId(params?.id ?? '')
  const canonicalUrl = id ? getCanonicalNfcUrl(id) : 'https://zamakuri.jp/i/ZMK-000001'
  const result = id ? await fetchNfcItem(id) : null
  const item = result?.status === 'registered' ? result.item : null
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(canonicalUrl)}`

  return (
    <main className="min-h-[100dvh] bg-[#f8fbf2] px-4 py-5 text-[#10291e]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="zmk-eyebrow text-[10px] text-[#b89558]">NFC WRITE</p>
            <h1 className="mt-1 text-2xl font-bold">NFC書き込み</h1>
          </div>
          <Link href="/admin/nfc" className="min-h-10 border border-[#10291e]/18 bg-white px-4 py-2 text-sm font-bold">戻る</Link>
        </div>
        <div className="grid gap-5 border border-[#10291e]/12 bg-white p-5 md:grid-cols-[1fr_260px]">
          <div>
            <dl className="grid gap-4 text-sm">
              <div><dt className="font-bold">ID</dt><dd className="mt-1 text-xl font-black">{id || '未指定'}</dd></div>
              <div><dt className="font-bold">品種名</dt><dd className="mt-1 font-bold">{item?.name_jp ?? item?.name_en ?? '未登録または未取得'}</dd></div>
              <div><dt className="font-bold">書き込むURL</dt><dd className="mt-1 break-all border border-[#10291e]/12 bg-[#fffef8] p-3 font-bold">{canonicalUrl}</dd></div>
            </dl>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <a href="https://apps.apple.com/jp/app/nfc-tools/id1252962749" target="_blank" rel="noreferrer" className="zmk-button zmk-button-primary">NFC Tools</a>
              <CopyButton value={canonicalUrl} />
              <Link href={`/i/${encodeURIComponent(id || 'ZMK-000001')}`} className="zmk-button">表示確認</Link>
            </div>
          </div>
          <div className="bg-[#fffef8] p-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="NFC書き込み用QR" className="mx-auto h-60 w-60" />
          </div>
        </div>
      </div>
    </main>
  )
}
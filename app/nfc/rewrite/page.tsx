import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import { fetchNfcItem, getCanonicalNfcUrl, normalizeNfcId } from '@/lib/nfc-items'
import CopyButton from './CopyButton'

type NfcRewritePageProps = {
  searchParams?: Promise<{
    id?: string
  }>
}

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'NFC書き込み | ZAMAKURI.JP',
}

export default async function NfcRewritePage({ searchParams }: NfcRewritePageProps) {
  const params = await searchParams
  const id = normalizeNfcId(params?.id ?? '')
  const canonicalUrl = id ? getCanonicalNfcUrl(id) : 'https://zamakuri.jp/i/ZMK-000001'
  const result = id ? await fetchNfcItem(id) : null
  const item = result?.status === 'registered' ? result.item : null
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(canonicalUrl)}`

  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="NFC書き込み"
        title={
          <>
            正規URLを
            <span className="block">タグへ書く。</span>
          </>
        }
        lead="iPhoneはWeb NFC書き込み非対応のため、URLコピーまたはQRからNFC Toolsへ渡して書き込みます。"
      />

      <section className="zmk-section">
        <div className="zmk-container max-w-4xl">
          <div className="zmk-card grid gap-6 p-6 md:grid-cols-[1fr_280px]">
            <div>
              <p className="zmk-eyebrow">WRITE DATA</p>
              <dl className="mt-6 grid gap-4 text-[#10291e]">
                <div>
                  <dt className="text-xs font-bold">ID</dt>
                  <dd className="mt-1 text-2xl font-black">{id || '未指定'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold">品種名</dt>
                  <dd className="mt-1 text-lg font-bold">{item?.name_jp ?? item?.name_en ?? '未登録または未取得'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold">正規URL</dt>
                  <dd className="mt-1 break-all rounded-[10px] border border-[#10291e]/12 bg-white p-3 text-sm font-bold">
                    {canonicalUrl}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a href="https://apps.apple.com/jp/app/nfc-tools/id1252962749" target="_blank" rel="noreferrer" className="zmk-button zmk-button-primary">
                  NFC Tools
                </a>
                <CopyButton value={canonicalUrl} />
                <Link href={`/i/${encodeURIComponent(id || 'ZMK-000001')}`} className="zmk-button">
                  表示確認
                </Link>
              </div>
            </div>
            <div className="rounded-[18px] border border-[#10291e]/12 bg-white p-4 text-center">
              <p className="mb-3 text-xs font-bold text-[#10291e]">QR表示</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="NFC書き込み用QRコード" className="mx-auto h-[260px] w-[260px]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

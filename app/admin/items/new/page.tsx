import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import { normalizeNfcId } from '@/lib/nfc-items'

type NewItemPageProps = {
  searchParams?: Promise<{
    id?: string
  }>
}

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '個体登録 | ZAMAKURI.JP',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NewItemPage({ searchParams }: NewItemPageProps) {
  const params = await searchParams
  const id = normalizeNfcId(params?.id ?? '')

  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="個体登録"
        title={
          <>
            NFC個体を
            <span className="block">登録する。</span>
          </>
        }
        lead="未登録IDを受け取り、品種・管理名・公開状態を登録するための入口です。正式な保存処理は管理DB連携後にここへ集約します。"
      />

      <section className="zmk-section">
        <div className="zmk-container max-w-3xl">
          <div className="zmk-card p-6">
            <p className="zmk-eyebrow">NEW ITEM</p>
            <div className="mt-6 rounded-[12px] border border-[#10291e]/12 bg-white p-4">
              <p className="text-xs font-bold text-[#10291e]">登録予定ID</p>
              <p className="mt-2 text-3xl font-black text-[#10291e]">{id || '未指定'}</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link href={`/nfc/rewrite?id=${encodeURIComponent(id)}`} className="zmk-button zmk-button-primary">
                書き込みへ
              </Link>
              <Link href="/admin" className="zmk-button">
                管理へ戻る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

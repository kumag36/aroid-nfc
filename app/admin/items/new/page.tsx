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
        lead="未登録IDを受け取り、NFC個体タグ管理で品種・入荷・順化・販売・顧客復旧情報を登録します。"
      />

      <section className="zmk-section">
        <div className="zmk-container max-w-3xl">
          <div className="zmk-card p-6">
            <p className="zmk-eyebrow">NEW ITEM</p>
            <div className="zmk-admin-panel mt-6 rounded-[8px] p-4">
              <p className="text-xs font-bold">登録予定ID</p>
              <p className="mt-2 text-3xl font-black">{id || '未指定'}</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link href={`/admin/nfc/individuals?uid=${encodeURIComponent(id)}`} className="zmk-button zmk-button-primary">
                個体タグ管理へ
              </Link>
              <Link href={`/admin/nfc/rewrite?id=${encodeURIComponent(id)}`} className="zmk-button">
                書き込みへ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

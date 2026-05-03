import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

type NotifyPageProps = {
  searchParams?: Promise<{
    plant?: string
  }>
}

export const metadata = {
  title: '入荷通知 | ZAMAKURI.JP',
  description: '気になる品種の入荷通知や購入相談を受け付けるページ。',
}

export default async function NotifyPage({ searchParams }: NotifyPageProps) {
  const params = await searchParams
  const plant = params?.plant
  const mailSubject = plant ? `入荷通知希望: ${plant}` : '入荷通知希望'

  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="入荷通知"
        title={
          <>
            欲しい株を
            <span className="block">逃さない。</span>
          </>
        }
        lead="在庫がない株、気になる品種、購入前に確認したいことはこちらから。Instagram DM または Gmail で受け付けています。"
        actions={
          <>
            <a href="https://www.instagram.com/zamakuri_plants/" target="_blank" rel="noreferrer" className="zmk-button zmk-button-primary">
              Instagram DM
            </a>
            <a href={`mailto:kumajuko@gmail.com?subject=${encodeURIComponent(mailSubject)}`} className="zmk-button text-[#fffef8]">
              Gmail
            </a>
          </>
        }
      />

      <section className="zmk-section">
        <div className="zmk-container max-w-3xl">
          <div className="zmk-card p-6">
            <p className="zmk-eyebrow">CONTACT GUIDE</p>
            <h2 className="mt-5">送ってほしい内容</h2>
            <ul className="mt-6 grid gap-3 text-[#10291e]">
              <li>品種名、または図鑑ページURL</li>
              <li>希望サイズ、予算感</li>
              <li>配送先の都道府県</li>
              <li>育成環境で不安なこと</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="zmk-button zmk-button-primary">
                販売中を見る
              </Link>
              <Link href="/dictionary" className="zmk-button">
                図鑑へ戻る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

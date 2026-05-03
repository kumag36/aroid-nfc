import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

const menuItems = [
  ['図鑑', '/dictionary'],
  ['販売中', '/shop'],
  ['入荷通知', '/notify'],
  ['店主より', '/owner'],
  ['歩み', '/history'],
  ['NFC確認', '/nfc/verify'],
  ['管理', '/admin'],
]

export const metadata = {
  title: 'メニュー | ZAMAKURI.JP',
}

export default function MenuPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="メニュー"
        title="どこへ行く？"
        lead="図鑑、販売中、NFC、管理画面への入口をまとめました。"
      />
      <section className="zmk-section">
        <div className="zmk-container max-w-3xl">
          <div className="grid gap-3">
            {menuItems.map(([label, href]) => (
              <Link key={href} href={href} className="zmk-card zmk-card-hover flex min-h-14 items-center justify-between p-5 text-lg font-bold text-[#10291e]">
                {label}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

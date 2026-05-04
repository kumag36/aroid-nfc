import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

const menuItems = [
  ['図鑑', '/dictionary'],
  ['NFC', '/nfc/verify'],
  ['漫画部屋', '/museum'],
  ['ショップ情報', '/about'],
  ['特定商取引法に基づく表記', '/legal'],
  ['店主より', '/owner'],
  ['音楽室', '/music'],
  ['管理', '/admin'],
]

export const metadata = {
  title: 'メニュー | ZAMAKURI.JP',
}

export default function MenuPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero eyebrow="MENU" title="メニュー" lead="図鑑、NFC、漫画部屋、ショップ情報への入口をまとめました。" />
      <section className="zmk-section">
        <div className="zmk-container max-w-3xl">
          <div className="grid gap-3">
            {menuItems.map(([label, href]) => (
              <Link key={href} href={href} className="zmk-card zmk-card-hover flex min-h-14 items-center justify-between p-5 text-lg font-bold text-[var(--zmk-ink-strong)]">
                {label}<span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
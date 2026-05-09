import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from './components/BrandHeader'

const routes = [
  ['ショップ情報', '完全予約制・所在地・店主の想いを確認できます。', '/about'],
  ['図鑑', 'モンステラとアロイドの品種情報を整理しています。', '/dictionary'],
  ['漫画部屋', '植物の育て方をマンガで読めます。', '/museum'],
  ['物置', '音楽、漫画、実験の記録。寄り道はこちら。', '/lab'],
] as const

export default function Home() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="zmk-public-hero px-4 pb-10 pt-28 sm:px-5 sm:pb-16 sm:pt-36">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="zmk-eyebrow mb-4">SINCE 2025 / ZAMAKURI PLANTS</p>
            <h1>ざまくりプランツ</h1>
            <p className="mt-5 max-w-2xl text-[15px] font-bold leading-8 text-[var(--zmk-ink-soft)] sm:text-[17px]">
              モンステラとアロイドを中心に、品種・個体・育成の記録を静かに深めていく植物店です。
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/about" className="zmk-button zmk-button-primary">ショップ情報</Link>
              <Link href="/dictionary" className="zmk-button">図鑑を見る</Link>
              <Link href="/museum" className="zmk-button">漫画を読む</Link>
              <Link href="/lab" className="zmk-button">物置へ</Link>
            </div>
          </div>
          <figure className="zmk-card order-1 mx-auto w-full max-w-[250px] p-4 sm:max-w-[340px] lg:order-2">
            <div className="relative aspect-square bg-white">
              <Image src="/brand/zamakuri-shop-logo.webp" alt="ざまくりプランツ" fill priority className="object-contain" sizes="340px" />
            </div>
            <figcaption className="mt-4 text-center text-[10px] font-bold text-[var(--zmk-ink-soft)] sm:text-[11px]">SINCE 2025 / ZAMAKURI PLANTS</figcaption>
          </figure>
        </div>
      </section>
      <section className="px-4 pb-12 sm:px-5">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
          {routes.map(([title, text, href], index) => (
            <Link key={href} href={href} className="zmk-card zmk-card-hover block p-5">
              <p className="zmk-eyebrow mb-4 text-[11px]">0{index + 1}</p>
              <h2 className="text-2xl">{title}</h2>
              <p className="mt-3 text-sm font-bold leading-7 text-[var(--zmk-ink-soft)]">{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

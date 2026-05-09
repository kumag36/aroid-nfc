import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from './components/BrandHeader'

const routes = [
  ['植中毒', '植物好きの感染度をゆるく判定します。', '/shokuchudoku'],
  ['音楽置き場', 'ラジカセで曲を流して、カセットからYouTubeへ飛べます。', '/lab'],
  ['漫画部屋', '植物のつまずきや世話のコツをマンガで読めます。', '/museum'],
] as const

const legalLinks = [
  ['特定商取引法に基づく表記', '/legal'],
  ['プライバシーポリシー', '/legal/privacy'],
  ['利用規約・販売条件', '/legal/terms'],
] as const

export default function Home() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="zmk-public-hero px-4 pb-10 pt-28 sm:px-5 sm:pb-16 sm:pt-36">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="order-1 lg:order-1">
            <p className="zmk-eyebrow mb-4">SINCE 2025 / ZAMAKURI PLANTS</p>
            <h1>ざまくりプランツ</h1>
            <p className="mt-5 max-w-2xl text-[15px] font-bold leading-8 text-[var(--zmk-ink-soft)] sm:text-[17px]">
              いま公開している入口をまとめました。準備中のページは、もう少し育ってから開きます。
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/shokuchudoku" className="zmk-button zmk-button-primary">植中毒へ</Link>
              <Link href="/lab" className="zmk-button">音楽へ</Link>
              <Link href="/museum" className="zmk-button">マンガへ</Link>
            </div>
          </div>
          <figure className="zmk-card order-2 mx-auto w-full max-w-[220px] p-4 sm:max-w-[340px] lg:order-2">
            <div className="relative aspect-square bg-white">
              <Image src="/brand/zamakuri-shop-logo.webp" alt="ざまくりプランツ" fill priority className="object-contain" sizes="340px" />
            </div>
            <figcaption className="mt-4 text-center text-[10px] font-bold text-[var(--zmk-ink-soft)] sm:text-[11px]">SINCE 2025 / ZAMAKURI PLANTS</figcaption>
          </figure>
        </div>
      </section>
      <section className="px-4 pb-32 sm:px-5 md:pb-12">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
          {routes.map(([title, text, href], index) => (
            <Link key={href} href={href} className="zmk-card zmk-card-hover block p-5">
              <p className="zmk-eyebrow mb-4 text-[11px]">0{index + 1}</p>
              <h2 className="text-2xl">{title}</h2>
              <p className="mt-3 text-sm font-bold leading-7 text-[var(--zmk-ink-soft)]">{text}</p>
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-wrap gap-3 text-sm font-bold text-[var(--zmk-ink-soft)]">
          {legalLinks.map(([label, href]) => (
            <Link key={href} href={href} className="underline underline-offset-4 hover:text-[var(--zmk-ink)]">
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from './components/BrandHeader'

export default function Home() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="px-5 pb-16 pt-32 sm:pt-40">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <p className="zmk-eyebrow mb-5 text-[#b89558]">SINCE 2025 / ZAMAKURI PLANTS</p>
            <h1 className="max-w-3xl text-[#10291e]">ざまくりプランツ</h1>
            <p className="mt-7 max-w-2xl text-[16px] font-bold leading-8 text-[#173b2a]">
              モンステラとアロイドを中心に、品種・個体・育成の記録を静かに深めていく植物店です。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/about" className="zmk-button zmk-button-primary">ショップ情報</Link>
              <Link href="/dictionary" className="zmk-button">図鑑を見る</Link>
              <Link href="/lab" className="zmk-button">物置へ</Link>
            </div>
          </div>
          <figure className="mx-auto w-full max-w-[360px] border border-[#10291e]/12 bg-white p-5 shadow-[0_18px_55px_rgba(44,106,75,0.12)]">
            <div className="relative aspect-square bg-white">
              <Image src="/brand/zamakuri-shop-logo.webp" alt="ざまくりプランツ" fill priority className="object-contain" sizes="360px" />
            </div>
            <figcaption className="mt-5 text-center text-[11px] font-bold tracking-[0.24em] text-[#315244]">SINCE 2025 / ZAMAKURI PLANTS</figcaption>
          </figure>
        </div>
      </section>
      <section className="bg-white px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            ['ショップ情報', '所在地、代表者、問い合わせ先、店主の思いを先に確認できます。', '/about'],
            ['図鑑', '品種の特徴と見分け方を、読みやすく整理していきます。', '/dictionary'],
            ['物置', '音楽、マンガ、実験の記録。少し寄り道したい人の入口です。', '/lab'],
          ].map(([title, text, href]) => (
            <Link key={href} href={href} className="border border-[#10291e]/10 bg-[#fffef8] p-5 transition active:scale-[0.99]">
              <h2 className="text-2xl text-[#10291e]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#315244]">{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
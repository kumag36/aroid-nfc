import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import MuseumGallery from './components/MuseumGallery'

export const metadata = {
  title: 'ざまくり美術館 | ざまくりプランツ',
  description: 'ざまくりプランツの漫画や作品を静かに展示するオンライン美術館。スマホ縦読み対応。',
}

export default function MuseumPage() {
  return (
    <main className="min-h-screen bg-[#06100b] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_18%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            ZAMAKURI MUSEUM
          </p>
          <h1 className="max-w-5xl text-[clamp(2.55rem,7vw,6.4rem)] font-medium leading-[1.08] tracking-normal">
            ざまくり
            <span className="block">美術館</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#eee7d7]/82 md:text-lg md:leading-9">
            適当に描いた漫画も、ここではちゃんと展示物。スマホでは縦読み、PCでは静かな展示室として楽しめます。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#gallery" className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]">
              展示を見る
            </a>
            <Link href="/museum/admin" className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#fffaf0]/24 bg-[#050806]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#d9ffd8]/55">
              管理者入口
            </Link>
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <MuseumGallery />
      </section>
    </main>
  )
}

import BrandHeader from '@/app/components/BrandHeader'
import MusicRoom from './components/MusicRoom'

export const metadata = {
  title: 'ざまくり音楽室 | ZAMAKURI.JP',
  description:
    'ざまくりプランツの音源と映像を静かに保管するオンライン音楽室。',
}

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-[#06100b] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_18%,rgba(217,255,216,0.13),transparent_31%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06100b] to-transparent" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-[560px] lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.68fr)] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              ZAMAKURI MUSIC ROOM
            </p>
            <h1 className="max-w-4xl text-[clamp(2.55rem,7vw,6.4rem)] font-medium leading-[1.08] tracking-normal">
              ざまくり
              <span className="block">音楽室</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#eee7d7]/82 md:text-lg md:leading-9">
              植物のそばに置いた音、作りかけの音、ふと思いついた旋律を静かに保管する部屋です。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#cassette"
                className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]"
              >
                音楽を聴く
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[560px] lg:ml-auto lg:pt-2">
            <MusicRoom variant="hero" />
          </div>
        </div>
      </section>
    </main>
  )
}

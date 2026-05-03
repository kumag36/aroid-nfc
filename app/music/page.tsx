import BrandHeader from '@/app/components/BrandHeader'
import MusicRoom from './components/MusicRoom'

export const metadata = {
  title: 'ざまくり音楽室 | ZAMAKURI.JP',
  description:
    'ざまくりプランツの音源を、白と植物の緑を基調にした清潔な空間で聴ける音楽室。',
}

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_82%_18%,rgba(217,255,216,0.58),transparent_29%),radial-gradient(circle_at_18%_76%,rgba(184,149,88,0.08),transparent_28%),linear-gradient(135deg,#fffef8_0%,#f8fcf2_42%,#dff5de_100%)] px-5 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f7fbf1] to-transparent" />
        <div className="pointer-events-none absolute right-[9%] top-32 h-px w-28 bg-[#b89558]/45 shadow-[0_0_24px_rgba(184,149,88,0.35)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-[560px] lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.68fr)] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              ZAMAKURI MUSIC ROOM
            </p>
            <h1 className="max-w-4xl text-[clamp(2.55rem,7vw,6.4rem)] font-medium leading-[1.08] tracking-normal text-[#10291e]">
              ざまくり
              <span className="block">音楽室</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#315244] md:text-lg md:leading-9">
              植物のそばに置いた音、作りかけの音、ふと思いついた旋律を静かに保管する部屋です。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#cassette"
                className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#2c6a4b]/30 bg-white/76 px-7 text-sm font-semibold tracking-[0.18em] text-[#173b2a] shadow-[0_18px_60px_rgba(44,106,75,0.10),inset_0_0_0_1px_rgba(255,255,255,0.72)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b89558]/55 hover:bg-[#fdfaf0]"
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

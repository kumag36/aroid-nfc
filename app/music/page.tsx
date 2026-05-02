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
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-[560px] lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.72fr)] lg:items-center">
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
                href="#tracks"
                className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]"
              >
                音楽を聴く
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative ml-auto max-w-[520px] border border-[#fffaf0]/12 bg-[#07120d]/72 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.28)] backdrop-blur-sm">
              <div className="mb-7 flex items-center justify-between gap-5 border-b border-[#fffaf0]/10 pb-5">
                <p className="text-[11px] font-semibold tracking-[0.28em] text-[#b89558]">
                  ON AIR DECK
                </p>
                <span className="text-[11px] tracking-[0.2em] text-[#d8d0bf]/55">LOCAL AUDIO</span>
              </div>
              <div className="grid gap-4">
                <div className="border border-[#d9ffd8]/18 bg-[#050806]/62 p-4">
                  <p className="mb-3 text-[10px] font-semibold tracking-[0.24em] text-[#d8d0bf]/48">
                    NOW PLAYING
                  </p>
                  <p className="truncate text-lg font-semibold tracking-[0.14em] text-[#eaffdf]">
                    ZAMAKURI CASSETTE ARCHIVE
                  </p>
                </div>
                <div className="grid grid-cols-12 gap-1 border border-[#fffaf0]/10 bg-[#e5d7a6]/88 p-3 shadow-[inset_0_0_24px_rgba(43,29,8,0.38)]">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-8 border border-black/10 ${
                        index < 7 ? 'bg-[#4f7e4d]' : index < 10 ? 'bg-[#c79d36]' : 'bg-[#883226]'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['PLAY', 'REW', 'FF'].map((label) => (
                    <div
                      key={label}
                      className="border border-[#fffaf0]/12 bg-[#fffaf0]/8 py-4 text-center text-[11px] font-semibold tracking-[0.2em] text-[#fffaf0]/72"
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 border border-[#d9ffd8]/18" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 border border-[#b89558]/22" />
            </div>
          </div>
        </div>
      </section>

      <section id="tracks" className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <MusicRoom />
      </section>
    </main>
  )
}

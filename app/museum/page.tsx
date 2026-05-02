import BrandHeader from '@/app/components/BrandHeader'
import MuseumGallery from './components/MuseumGallery'

export const metadata = {
  title: 'ざまくり美術館 | ZAMAKURI.JP',
  description:
    'ざまくりプランツの漫画や作品を静かに展示するオンライン美術館。',
}

export default function MuseumPage() {
  return (
    <main className="min-h-screen bg-[#06100b] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_18%,rgba(217,255,216,0.13),transparent_31%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06100b] to-transparent" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-[560px] lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              ZAMAKURI MUSEUM
            </p>
            <h1 className="max-w-4xl text-[clamp(2.55rem,7vw,6.4rem)] font-medium leading-[1.08] tracking-normal">
              ざまくり
              <span className="block">美術館</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#eee7d7]/82 md:text-lg md:leading-9">
              適当に描いた漫画も、ここではちゃんと展示物。スマホでも縦読みでも静かに楽しめる展示室です。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#gallery"
                className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]"
              >
                展示を見る
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative ml-auto max-w-[520px] border border-[#fffaf0]/12 bg-[#07120d]/72 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.28)] backdrop-blur-sm">
              <div className="mb-7 flex items-center justify-between gap-5 border-b border-[#fffaf0]/10 pb-5">
                <p className="text-[11px] font-semibold tracking-[0.28em] text-[#b89558]">
                  PRIVATE GALLERY
                </p>
                <span className="text-[11px] tracking-[0.2em] text-[#d8d0bf]/55">ADMIN ONLY</span>
              </div>
              <div className="grid grid-cols-[0.74fr_1fr] gap-4">
                <div className="aspect-[3/4] border border-[#d9ffd8]/16 bg-[#d9ffd8]/10" />
                <div className="grid gap-4">
                  <div className="border border-[#fffaf0]/10 bg-[#050806]/52 p-4">
                    <p className="mb-3 text-[10px] font-semibold tracking-[0.24em] text-[#d8d0bf]/48">
                      EXHIBITION NOTE
                    </p>
                    <p className="text-xl font-medium leading-snug text-[#fffaf0]">
                      作品を増やすほど、展示室は深くなる。
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['MANGA', 'ART', 'LOG', 'ROOM'].map((label) => (
                      <div
                        key={label}
                        className="border border-[#fffaf0]/10 bg-[#fffaf0]/6 py-5 text-center text-[10px] font-semibold tracking-[0.2em] text-[#fffaf0]/62"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 border border-[#d9ffd8]/18" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 border border-[#b89558]/22" />
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <MuseumGallery />
      </section>
    </main>
  )
}

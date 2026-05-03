import BrandHeader from '@/app/components/BrandHeader'
import MuseumGallery from './components/MuseumGallery'

export const metadata = {
  title: 'ざまくり漫画室 | ZAMAKURI.JP',
  description:
    'ざまくりプランツの漫画作品を、スマホは縦読み、タブレットとPCは横読みで楽しめる漫画室。',
}

export default function MuseumPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:var(--font-zamakuri)] dark:bg-[#07110c] dark:text-[#f7fbf1]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_18%,rgba(217,255,216,0.75),transparent_31%),linear-gradient(135deg,#fffef8_0%,#f7fbf1_50%,#d9ffd8_100%)] px-5 pb-16 pt-32 dark:bg-[radial-gradient(circle_at_78%_18%,rgba(217,255,216,0.18),transparent_31%),linear-gradient(135deg,#07110c_0%,#10291e_56%,#07110c_100%)] md:pb-24 md:pt-40">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f7fbf1] to-transparent dark:from-[#07110c]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-[540px] lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,0.7fr)] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              ZAMAKURI MANGA ROOM
            </p>
            <h1 className="max-w-4xl text-[clamp(2.55rem,7vw,6.4rem)] font-bold leading-[1.08] tracking-normal text-[#143326] dark:text-[#f7fbf1]">
              ざまくり
              <span className="block">漫画室</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#315244]/82 dark:text-[#d9ffd8]/82 md:text-lg md:leading-9">
              わしが描いた漫画を、ピッコマのように気軽に読める部屋です。スマホでは縦読み、タブレットとPCでは横読みで作品を楽しめます。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#gallery"
                className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#2c6a4b]/28 bg-white/80 px-7 text-sm font-semibold tracking-[0.16em] text-[#173b2a] shadow-[0_18px_60px_rgba(44,106,75,0.10),inset_0_0_0_1px_rgba(255,255,255,0.72)] transition hover:-translate-y-0.5 hover:border-[#b89558]/55 dark:border-[#d9ffd8]/28 dark:bg-[#d9ffd8]/10 dark:text-[#f7fbf1]"
              >
                作品を読む
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative ml-auto max-w-[520px] border border-[#2c6a4b]/12 bg-white/76 p-6 shadow-[0_32px_120px_rgba(44,106,75,0.14)] backdrop-blur-sm dark:border-[#d9ffd8]/14 dark:bg-[#10291e]/80">
              <div className="mb-7 flex items-center justify-between gap-5 border-b border-[#2c6a4b]/10 pb-5 dark:border-[#d9ffd8]/12">
                <p className="text-[11px] font-semibold tracking-[0.28em] text-[#b89558]">
                  READING STYLE
                </p>
                <span className="text-[11px] tracking-[0.2em] text-[#315244]/55 dark:text-[#d9ffd8]/62">
                  SMARTOON READY
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['PHONE', '縦読み'],
                  ['TABLET', '横読み'],
                  ['DESKTOP', '横読み'],
                  ['ADMIN', '作品追加'],
                ].map(([label, text]) => (
                  <div
                    key={label}
                    className="border border-[#2c6a4b]/10 bg-[#fffef8]/70 p-5 dark:border-[#d9ffd8]/12 dark:bg-[#07110c]/44"
                  >
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-[#b89558]">{label}</p>
                    <p className="mt-3 text-xl font-bold text-[#143326] dark:text-[#f7fbf1]">{text}</p>
                  </div>
                ))}
              </div>
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

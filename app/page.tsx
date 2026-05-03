import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from './components/BrandHeader'

const instagramEmbedUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_EMBED_URL ??
  'https://www.instagram.com/zamakuri_plants/embed'
const instagramProfileUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL ??
  'https://www.instagram.com/zamakuri_plants/'

const historyItems = [
  {
    period: 'Before 2025',
    title: '観察する目が育つ',
    image: '/history/origin.jpg',
    text: '生き物と向き合う時間の中で、状態を読む感覚が少しずつ育っていきました。',
  },
  {
    period: '2025 / Opening',
    title: 'ざまくりプランツ始動',
    image: '/history/opening.jpg',
    text: '神奈川県座間市。小さな軒先から、確かに良いと思える株だけを届ける場所として始まりました。',
  },
  {
    period: '2025 / Event',
    title: '現場で信頼を積む',
    image: '/history/event.jpg',
    text: '実物を見て、触れて、納得してもらう販売。植物の状態がそのまま信頼になりました。',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_82%_12%,rgba(217,255,216,0.72),transparent_30%),radial-gradient(circle_at_12%_80%,rgba(184,149,88,0.08),transparent_26%),linear-gradient(135deg,#fffef8_0%,#f8fcf2_48%,#e4f7df_100%)] px-5 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7fbf1] to-transparent" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-[620px] lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,0.64fr)] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              ZAMAKURI PLANTS
            </p>
            <h1 className="max-w-5xl text-[clamp(2.65rem,7vw,6.2rem)] font-medium leading-[1.08] tracking-normal text-[#10291e]">
              ざまくりプランツ
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#315244] md:text-lg md:leading-9">
              モンステラとアロイドを中心に、品種・個体・育成の記録を静かに深めていく植物屋です。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/dictionary"
                className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#2c6a4b]/28 bg-white/80 px-7 text-sm font-semibold tracking-[0.16em] text-[#173b2a] shadow-[0_18px_60px_rgba(44,106,75,0.10),inset_0_0_0_1px_rgba(255,255,255,0.72)] transition hover:-translate-y-0.5 hover:border-[#b89558]/55"
              >
                図鑑を見る
              </Link>
              <Link
                href="/history"
                className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#2c6a4b]/14 bg-[#d9ffd8]/38 px-7 text-sm font-semibold tracking-[0.16em] text-[#173b2a] transition hover:-translate-y-0.5 hover:bg-[#d9ffd8]/58"
              >
                歩みを見る
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[390px]">
            <div className="absolute -inset-6 bg-[radial-gradient(circle,rgba(217,255,216,0.72),transparent_68%)]" />
            <div className="relative border border-[#2c6a4b]/12 bg-white/76 p-6 shadow-[0_34px_120px_rgba(44,106,75,0.14)] backdrop-blur-sm">
              <Image
                src="/brand/zamakuri-shop-logo.webp"
                alt="ざまくりプランツ"
                width={640}
                height={867}
                priority
                className="mx-auto h-auto w-full max-w-[300px]"
              />
              <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#b89558]/40 to-transparent" />
              <p className="mt-5 text-center text-[11px] font-semibold tracking-[0.22em] text-[#2c6a4b]/68">
                SINCE 2025 / ZAMA
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            ['01', '品種を知る', '流通名・学名・特徴を整理し、見分けるための入口を作ります。'],
            ['02', '個体を残す', 'NFCとDBで、一株ごとの履歴を迷子にしない管理へ。'],
            ['03', '育成を深める', '写真、環境、変化を重ねて、株の時間を記録します。'],
          ].map(([number, title, text]) => (
            <article key={number} className="border border-[#2c6a4b]/10 bg-white/78 p-6 shadow-[0_24px_70px_rgba(44,106,75,0.08)]">
              <p className="mb-5 text-xs font-semibold tracking-[0.22em] text-[#b89558]">{number}</p>
              <h2 className="text-2xl font-medium leading-tight text-[#10291e]">{title}</h2>
              <p className="mt-5 text-[15px] leading-8 text-[#315244]/76">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fffef8] px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.78fr)_420px] lg:items-start">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              HISTORY
            </p>
            <h2 className="max-w-4xl text-[clamp(2rem,4.5vw,4.5rem)] font-medium leading-tight text-[#10291e]">
              開業から走り続けた、ざまくりプランツの歩み。
            </h2>
            <div className="mt-10 grid gap-4">
              {historyItems.map((item) => (
                <Link
                  key={item.title}
                  href="/history"
                  className="group grid gap-5 border border-[#2c6a4b]/10 bg-white/76 p-4 transition hover:-translate-y-0.5 hover:border-[#b89558]/35 sm:grid-cols-[132px_1fr]"
                >
                  <div className="relative min-h-32 overflow-hidden bg-[#e4f7df]">
                    <Image src={item.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="132px" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">{item.period}</p>
                    <h3 className="mt-3 text-xl font-medium text-[#10291e]">{item.title}</h3>
                    <p className="mt-3 text-[14px] leading-7 text-[#315244]/76">{item.text}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-[#2c6a4b]/10 bg-[#f7fbf1]/78 p-4 shadow-[0_24px_80px_rgba(44,106,75,0.10)]">
            <div className="mb-4 flex items-center justify-between border-b border-[#2c6a4b]/10 pb-3">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">LIVE RECORD</p>
              <span className="text-xs text-[#315244]/60">Instagram</span>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-white">
              <iframe
                src={instagramEmbedUrl}
                title="ざまくりプランツ Instagram"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <Link
              href={instagramProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center border border-[#2c6a4b]/18 bg-white/70 px-5 text-xs font-semibold tracking-[0.16em] text-[#173b2a] transition hover:border-[#b89558]/45"
            >
              Instagramで見る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

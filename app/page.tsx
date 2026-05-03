import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from './components/BrandHeader'

const instagramEmbedUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_EMBED_URL ??
  'https://www.instagram.com/zamakuri_plants/embed'
const instagramProfileUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL ??
  'https://www.instagram.com/zamakuri_plants/'

const featureCards = [
  ['01', '品種を知る', '流通名・学名・特徴を整理し、見分けるための入口を作ります。'],
  ['02', '個体を残す', 'NFCとDBで、一株ごとの履歴を迷子にしない管理へつなげます。'],
  ['03', '育成を深める', '写真、環境、変化を重ねて、株の時間を記録します。'],
]

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
    <main className="zmk-page">
      <BrandHeader />

      <section className="zmk-hero">
        <Image
          src="/history/hero-botanical.png"
          alt=""
          fill
          priority
          className="zmk-hero-media"
          sizes="100vw"
        />
        <div className="zmk-hero-shade" />
        <div className="zmk-hero-fade" />
        <div className="zmk-container zmk-hero-body">
          <div className="zmk-rule" />
          <p className="zmk-eyebrow mb-5">ZAMAKURI PLANTS</p>
          <h1 className="zmk-title">ざまくりプランツ</h1>
          <p className="zmk-lead mt-8">
            モンステラとアロイドを中心に、品種・個体・育成の記録を静かに深めていく植物屋です。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/dictionary" className="zmk-button zmk-button-primary">
              図鑑を見る
            </Link>
            <Link href="/history" className="zmk-button text-[#fffef8]">
              歩みを見る
            </Link>
          </div>
        </div>
      </section>

      <section className="zmk-section">
        <div className="zmk-container grid gap-4 md:grid-cols-3">
          {featureCards.map(([number, title, text]) => (
            <article key={number} className="zmk-card zmk-card-hover p-6">
              <p className="zmk-eyebrow mb-5 text-xs">{number}</p>
              <h2 className="text-2xl">{title}</h2>
              <p className="zmk-muted mt-5 text-[15px] leading-8">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="zmk-section zmk-section-soft">
        <div className="zmk-container grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_420px] lg:items-start">
          <div>
            <p className="zmk-eyebrow mb-5">HISTORY</p>
            <h2 className="max-w-4xl">開業から走り続けた、ざまくりプランツの歩み。</h2>
            <div className="mt-10 grid gap-4">
              {historyItems.map((item) => (
                <Link key={item.title} href="/history" className="zmk-card zmk-card-hover group grid gap-5 p-4 sm:grid-cols-[132px_1fr]">
                  <div className="relative min-h-32 overflow-hidden bg-[#102018]">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover opacity-[0.88] transition duration-500 group-hover:scale-[1.03]"
                      sizes="132px"
                    />
                  </div>
                  <div>
                    <p className="zmk-eyebrow text-[11px]">{item.period}</p>
                    <h3 className="mt-3 text-xl">{item.title}</h3>
                    <p className="zmk-muted mt-3 text-[14px] leading-7">{item.text}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="zmk-card p-4">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--zmk-border)] pb-3">
              <p className="zmk-eyebrow text-[11px]">LIVE RECORD</p>
              <span className="zmk-muted text-xs">Instagram</span>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-white dark:bg-[#07110c]">
              <iframe
                src={instagramEmbedUrl}
                title="ざまくりプランツ Instagram"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <Link href={instagramProfileUrl} target="_blank" rel="noreferrer" className="zmk-button mt-4 w-full">
              Instagramで見る
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}

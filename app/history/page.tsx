import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'

const history = [
  {
    period: 'Before 2025',
    title: '原点・観察する目が育つ',
    image: '/history/origin.jpg',
    lead: '好きから始まり、いつしか「状態を読む」習慣になった時間。',
    text: `メダカ、観賞魚、爬虫類、昆虫、タランチュラ。ジャンルは違っても、向き合っていたのはいつも「生きているものの変化」でした。

水、温度、光、餌、環境。少しの違いで状態が変わる。その理由を見つけることが、遊びであり、学びでもありました。`,
  },
  {
    period: 'Immersion',
    title: 'モンステラへの没入',
    image: '/history/plants.jpg',
    lead: '希少品種を集めるだけではなく、差を見分ける段階へ。',
    text: `タイコンステレーション、ホワイトタイガー、イエローマリリン、ホワイトモンスター。希少な名前に触れるほど、品種名だけでは語れない個体差が見えてきました。

斑の入り方、葉の厚み、節間、根の強さ、展開の癖。美しさは一枚の写真ではなく、育つ過程の中にあります。`,
  },
  {
    period: 'Opening / 0 Month',
    title: 'ざまくりプランツ始動',
    image: '/history/opening.jpg',
    lead: '神奈川県座間市。平屋の軒先から始まった小さな植物屋。',
    text: `大きな店舗も、派手な看板も、過剰な在庫もない。最初にあったのは、確実に良いと思える株だけを届けたいという判断でした。

小さく始めることは、妥協ではありません。仕入れ、管理、手渡し、説明。その一つひとつに目が届く大きさで始めることを選びました。`,
  },
  {
    period: 'Event / 3 Months',
    title: 'イベント出店で、現場に立つ',
    image: '/history/event.jpg',
    lead: '画面越しではなく、実物を見てもらうことで信頼を積み上げる。',
    text: `最初に選んだのは、ネットだけで完結する販売ではなく、実際に見て、触れて、納得してもらう現場でした。

葉の質感、根の状態、斑の入り方。言葉だけでは伝わらない情報が、目の前の株にはあります。`,
  },
  {
    period: 'Asia / 9 Months',
    title: '海外との接点、基準が上がる',
    image: '/history/overseas.jpg',
    lead: 'タイ、中国、ベトナム。熱量の高い現場に触れ、基準を更新する。',
    text: `アジアを代表するナーセリーや、世界中のマニアが集まる流通の現場。そこには、画像以上のスピードと熱量がありました。

入ってくる株のレベル、選別の基準、情報の流れ。希少性だけに流されず、本物として扱うためには、見る目も管理もさらに上げる必要がある。`,
  },
]

export const metadata = {
  title: 'History | ZAMAKURI.JP',
  description: 'ざまくりプランツの開業からの歩みを記録する年表ページ。',
}

export default function HistoryPage() {
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
          <p className="zmk-eyebrow mb-5">ZAMAKURI PLANTS HISTORY</p>
          <h1 className="zmk-title">
            ざまくりプランツ
            <span className="block">1年の歩み</span>
          </h1>
          <p className="zmk-lead mt-8">
            開業から走り続けた11か月。約1年分の熱量を、小さな植物屋の記録として静かに残します。
          </p>
        </div>
      </section>

      <section className="zmk-section">
        <div className="zmk-container">
          <div className="zmk-split-head mb-16">
            <div>
              <p className="zmk-eyebrow mb-5">SINCE 2025 / ZAMAKURI PLANTS</p>
              <h2>年表として見る、判断の積み重ね。</h2>
            </div>
            <p className="zmk-muted text-[15px] leading-8">
              販売記録ではなく、植物と向き合う判断、現場で得た信頼、そして次の基準へ進むための記録です。
            </p>
          </div>

          <div className="grid gap-6">
            {history.map((item, index) => (
              <article
                key={item.title}
                className="zmk-card zmk-card-hover group grid gap-8 p-5 md:grid-cols-[120px_minmax(0,1fr)_420px] md:items-stretch md:p-7"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--zmk-border)] pb-5 md:block md:border-b-0 md:border-r md:pb-0 md:pr-7">
                  <p className="text-3xl font-bold leading-none text-[#b89558]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="zmk-muted mt-1 text-[11px] font-semibold tracking-[0.18em] md:mt-5">
                    {item.period}
                  </p>
                </div>

                <div className="flex flex-col justify-center md:py-3">
                  <h3 className="font-bold text-[var(--zmk-ink-strong)]">{item.title}</h3>
                  <p className="mt-5 border-l border-[#b89558]/45 pl-4 text-[15px] leading-8 text-[var(--zmk-ink)]">
                    {item.lead}
                  </p>
                  <p className="zmk-muted mt-6 whitespace-pre-line text-[15px] leading-8">
                    {item.text}
                  </p>
                </div>

                <div className="relative min-h-[260px] overflow-hidden bg-[#102018] md:min-h-[360px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover opacity-[0.86] saturate-[0.8] contrast-[1.04] transition duration-700 group-hover:scale-[1.03]"
                    sizes="(min-width: 768px) 34vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,6,0.02),rgba(5,8,6,0.42))]" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="zmk-section zmk-section-soft">
        <div className="zmk-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="zmk-muted max-w-2xl text-[15px] leading-8">
            ここから、図鑑とNFC個体管理へ。品種の知識と、一株ごとの履歴をつなげていきます。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dictionary" className="zmk-button zmk-button-primary">
              図鑑を見る
            </Link>
            <Link href="/" className="zmk-button">
              トップへ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

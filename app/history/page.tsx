import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'

const history = [
  {
    period: 'Before 2025',
    title: '原点｜観察する目が育つ',
    image: '/history/origin.jpg',
    lead: '好きから始まり、いつしか「状態を読む」習慣になった時間。',
    text: `メダカ、観賞魚、爬虫類、昆虫、タランチュラ。ジャンルは違っても、向き合っていたのはいつも「生きているものの変化」でした。

水、温度、光、餌、環境。少しの違いで状態が変わる。その理由を見つけることが、遊びであり、学びでもありました。`,
  },
  {
    period: 'Immersion',
    title: 'モンステラへの没入',
    image: '/history/plants.jpg',
    lead: '希少品種を集めるだけではなく、違いを見分ける段階へ。',
    text: `タイコンステレーション、ホワイトタイガー、イエローマリリン、ホワイトモンスター。希少な名前に触れるほど、品種名だけでは語れない個体差が見えてきました。

斑の入り方、葉の厚み、節間、根の強さ、展開の癖。美しさは一枚の写真ではなく、育つ過程の中にあります。`,
  },
  {
    period: 'Opening / 0 Month',
    title: 'ざまくりプランツ始動',
    image: '/history/opening.jpg',
    lead: '神奈川県座間市、平屋の軒先から始まった小さな植物屋。',
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
    lead: 'タイ、中国、ベトナム。熱量の高い現場に触れ、扱う覚悟を更新する。',
    text: `アジアを代表するナーセリーや、世界中のマニアが集まる流通の現場。そこには、想像以上のスピードと熱量がありました。

入ってくる株のレベル、選別の基準、情報の流れ。希少性だけに流されず、本物として扱うためには、見る目も管理もさらに上げる必要がある。`,
  },
]

export const metadata = {
  title: 'History | ZAMAKURI.JP',
  description: 'ざまくりプランツの開業からの歩みを記録する年表ページ。',
}

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#fffef8] text-[#143326] [font-family:var(--font-zamakuri)]">
      <BrandHeader />

      <section className="relative min-h-[82vh] overflow-hidden bg-[#f1f8ed] px-5 pb-20 pt-32 md:pt-40">
        <Image
          src="/history/hero-botanical.png"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.42] saturate-[0.9]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,7,0.97)_0%,rgba(8,16,12,0.84)_48%,rgba(8,16,12,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffef8] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-7xl flex-col justify-center">
          <div className="mb-8 h-px w-28 bg-[#d9ffd8]/50" />
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            ZAMAKURI PLANTS HISTORY
          </p>
          <h1 className="max-w-5xl text-[clamp(2.6rem,6.4vw,6.2rem)] font-medium leading-[1.08] tracking-normal">
            ざまくりプランツ
            <span className="block">1年の歩み</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#315244]/85 md:text-lg md:leading-9">
            開業から走り続けた11か月。約1年分の熱量を、小さな植物屋の記録として静かに残します。
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_10%,rgba(217,255,216,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-16 grid gap-8 border-b border-[#2c6a4b]/10 pb-12 md:grid-cols-[1fr_420px] md:items-end">
            <div>
              <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
                SINCE 2025 / ZAMAKURI PLANTS
              </p>
              <h2 className="max-w-4xl text-[clamp(2.2rem,5vw,5rem)] font-medium leading-tight">
                年表として見る、判断の積み重ね。
              </h2>
            </div>
            <p className="text-[15px] leading-8 text-[#315244]/72">
              販売記録ではなく、植物と向き合う判断、現場で得た信頼、そして次の基準へ進むための記録です。
            </p>
          </div>

          <div className="grid gap-6">
            {history.map((item, index) => (
              <article
                key={item.title}
                className="group grid gap-8 border border-[#2c6a4b]/10 bg-white/86 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] transition duration-300 hover:border-[#d9ffd8]/30 md:grid-cols-[120px_minmax(0,1fr)_420px] md:items-stretch md:p-7"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#2c6a4b]/10 pb-5 md:block md:border-b-0 md:border-r md:pb-0 md:pr-7">
                  <p className="text-3xl font-medium leading-none text-[#d9ffd8]/82">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-[#315244]/48 md:mt-5">
                    {item.period}
                  </p>
                </div>

                <div className="flex flex-col justify-center md:py-3">
                  <h3 className="text-[clamp(1.55rem,3vw,2.5rem)] font-medium leading-tight text-[#143326]">
                    {item.title}
                  </h3>
                  <p className="mt-5 border-l border-[#d9ffd8]/35 pl-4 text-[15px] leading-8 text-[#315244]/86">
                    {item.lead}
                  </p>
                  <p className="mt-6 whitespace-pre-line text-[15px] leading-8 text-[#315244]/72">
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

      <section className="border-t border-[#2c6a4b]/10 bg-[#f7fbf1] px-5 py-16 text-[#191a15] md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[15px] leading-8 text-[#665f55]">
            ここから、図鑑とNFC個体管理へ。品種の知識と、一株ごとの履歴をつなげていきます。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dictionary" className="inline-flex min-h-11 min-w-40 items-center justify-center border border-[#191a15] bg-[#191a15] px-5 text-xs font-semibold tracking-[0.18em] text-[#143326]">
              図鑑を見る
            </Link>
            <Link href="/" className="inline-flex min-h-11 min-w-40 items-center justify-center border border-[#191a15]/18 px-5 text-xs font-semibold tracking-[0.18em] text-[#191a15]">
              トップへ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

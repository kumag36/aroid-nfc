import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from './components/BrandHeader'

const instagramEmbedUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_EMBED_URL ??
  'https://www.instagram.com/zamakuri_plants/embed'
const instagramProfileUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL ??
  'https://www.instagram.com/zamakuri_plants/'

const history = [
  {
    period: 'Before 2025',
    title: '原点｜観察する目が育つ',
    image: '/history/origin.jpg',
    lead: '好きから始まり、いつしか「状態を読む」習慣になった時間。',
    text: `メダカ、観賞魚、爬虫類、昆虫、タランチュラ。ジャンルは違っても、向き合っていたのはいつも「生きているものの変化」でした。

水、温度、光、餌、環境。少しの違いで状態が変わる。その理由を見つけることが、遊びであり、学びでもありました。

ざまくりプランツの目利きは、販売から急に始まったものではありません。長く積み重なった観察の感覚が、植物を見る目の土台になっています。`,
  },
  {
    period: 'Immersion',
    title: 'モンステラへの没入',
    image: '/history/plants.jpg',
    lead: '希少品種を集めるだけではなく、違いを見分ける段階へ。',
    text: `タイコンステレーション、ホワイトタイガー、イエローマリリン、ホワイトモンスター。希少な名前に触れるほど、品種名だけでは語れない個体差が見えてきました。

斑の入り方、葉の厚み、節間、根の強さ、展開の癖。美しさは一枚の写真ではなく、育つ過程の中にあります。

この頃から、ただ仕入れて並べるのではなく「良い株とは何か」を自分の基準で確かめるようになりました。`,
  },
  {
    period: 'Opening / 0 Month',
    title: 'ざまくりプランツ始動',
    image: '/history/opening.jpg',
    lead: '神奈川県座間市、平屋の軒先から始まった小さな植物屋。',
    text: `大きな店舗も、派手な看板も、過剰な在庫もない。最初にあったのは、確実に良いと思える株だけを届けたいという判断でした。

小さく始めることは、妥協ではありません。仕入れ、管理、手渡し、説明。その一つひとつに目が届く大きさで始めることを選びました。

ざまくりプランツは、ここから「売る場所」ではなく、植物と人の時間をつなぐ場所として動き出します。`,
  },
  {
    period: 'Event / 3 Months',
    title: 'イベント出店で、現場に立つ',
    image: '/history/event.jpg',
    lead: '画面越しではなく、実物を見てもらうことで信頼を積み上げる。',
    text: `最初に選んだのは、ネットだけで完結する販売ではなく、実際に見て、触れて、納得してもらう現場でした。

葉の質感、根の状態、斑の入り方。言葉だけでは伝わらない情報が、目の前の株にはあります。

「状態いいですね」。その一言は、価格や希少性よりも強い証明でした。ざまくりプランツの基準が、現場で少しずつ形になっていきました。`,
  },
  {
    period: 'Asia / 9 Months',
    title: '海外との接点、基準が上がる',
    image: '/history/overseas.jpg',
    lead: 'タイ、中国、ベトナム。熱量の高い現場に触れ、扱う覚悟を更新する。',
    text: `アジアを代表するナーセリーや、世界中のマニアが集まる流通の現場。そこには、想像以上のスピードと熱量がありました。

入ってくる株のレベル、選別の基準、情報の流れ。希少性だけに流されず、本物として扱うためには、見る目も管理もさらに上げる必要がある。

この接点を経て、ざまくりプランツは「珍しい株を扱う店」から、「違いを理解して届ける場所」へ進んでいきます。`,
  },
]
export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#191a15] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative min-h-[92vh] overflow-hidden bg-[#08100c] text-[#fffaf0]">
        <Image
          src="/history/hero-botanical.png"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.46] saturate-[0.9]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,7,0.97)_0%,rgba(8,16,12,0.84)_48%,rgba(8,16,12,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08100c] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-28">
          <div className="mb-8 h-px w-28 bg-[#d9ffd8]/50" />
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            ZAMAKURI PLANTS 1 YEAR HISTORY
          </p>
          <h1 className="max-w-5xl text-[clamp(2.5rem,6.4vw,6.2rem)] font-medium leading-[1.1] tracking-normal">
            ざまくりプランツ
            <span className="block">1年の歩み</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#eee7d7]/85">
            開業から走り続けた11か月。約1年分の熱量を、静かな記録として。
            <br />
            平屋の軒先から始まった小さな植物屋が、全国の植物好きとつながる場所へ育つまで。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#history"
              className="inline-flex min-h-12 min-w-48 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]"
            >
              年表を見る
            </a>
            <Link
              href="/dictionary"
              className="inline-flex min-h-12 min-w-48 items-center justify-center border border-[#fffaf0]/28 bg-[#050806]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#d9ffd8]/55"
            >
              図鑑を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbf1] px-5 py-20 text-[#191a15] md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#8f5949]">
              INSTAGRAM
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-medium leading-tight">
              いまのざまくりを、静かに覗く。
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-8 text-[#665f55]">
              入荷、育成、イベントの空気感を日々の記録として。余白を持たせ、ブランドの静けさに馴染む展示として配置しています。
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[500px] border border-[#191a15]/12 bg-[#fbfff6] shadow-[0_28px_90px_rgba(25,26,21,0.10)]">
            <div className="flex items-center justify-between border-b border-[#191a15]/10 px-4 py-3">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8f5949]">
                LIVE RECORD
              </p>
              <span className="text-xs text-[#665f55]/70">Instagram</span>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-[#fbfff6]">
              <iframe
                src={instagramEmbedUrl}
                title="ざまくりプランツ Instagram"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="border-t border-[#191a15]/10 px-4 py-4 text-center">
              <Link
                href={instagramProfileUrl}
                className="inline-flex min-h-11 items-center justify-center border border-[#191a15]/18 px-5 text-xs font-semibold tracking-[0.18em] text-[#191a15] transition duration-300 hover:-translate-y-0.5 hover:border-[#191a15]/45"
                target="_blank"
                rel="noreferrer"
              >
                Instagramで見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050806] px-5 py-20 text-[#fffaf0] md:py-24">
        <div className="mx-auto grid max-w-7xl gap-4 border-y border-[#fffaf0]/10 py-8 md:grid-cols-3">
          {[
            ['01', '状態を見て渡す', '株の表情、根、葉の動きを見て、納得できるものだけを届けます。'],
            ['02', '育成まで見据える', '買って終わりではなく、環境に馴染むまでを植物の時間として捉えます。'],
            ['03', '個体を記録する', 'NFCと図鑑で、品種名だけでは見えない一株ごとの情報を残します。'],
          ].map(([number, title, text]) => (
            <article key={number} className="border-[#fffaf0]/10 py-4 md:border-l md:px-8 md:first:border-l-0">
              <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-[#b89558]">
                {number}
              </p>
              <h3 className="text-2xl font-medium leading-tight">{title}</h3>
              <p className="mt-4 text-[15px] leading-8 text-[#eee7d7]/72">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 border-b border-[#191a15]/10 px-5 py-20 md:grid-cols-[220px_1fr] md:py-28">
        <p className="text-xs font-bold tracking-[0.28em] text-[#8f5949]">SINCE 2025</p>
        <div className="max-w-4xl">
          <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-medium leading-tight">
            派手さではなく、確かな目利きで残るブランドへ。
          </h2>
          <p className="mt-8 text-[15px] leading-8 text-[#6a645b]">
            ざまくりプランツが大切にしているのは、植物の希少性だけではありません。
            育てる人の暮らしに馴染む姿、時間を重ねたときの美しさ、そして手渡すまでの
            ひとつひとつの判断。その積み重ねを、年表として見える形にしました。
          </p>
        </div>
      </section>

      <section id="history" className="relative overflow-hidden bg-[#050806] px-5 py-20 text-[#fffaf0] md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_10%,rgba(217,255,216,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-16 grid gap-8 border-b border-[#fffaf0]/10 pb-12 md:grid-cols-[1fr_420px] md:items-end">
            <div>
              <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
                CHRONOLOGY / SINCE 2025
              </p>
              <h2 className="max-w-4xl text-[clamp(2.2rem,5vw,5rem)] font-medium leading-tight">
                ざまくりプランツ年表
              </h2>
            </div>
            <p className="text-[15px] leading-8 text-[#eee7d7]/72">
              開業から走り続けた11か月。販売記録ではなく、植物と向き合う判断、現場で得た信頼、そして次の基準へ進むための記録です。
            </p>
          </div>

          <div className="grid gap-6">
            {history.map((item, index) => (
              <article
                key={item.title}
                className="group grid gap-8 border border-[#fffaf0]/10 bg-[#07120d]/86 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] transition duration-300 hover:border-[#d9ffd8]/30 md:grid-cols-[120px_minmax(0,1fr)_420px] md:items-stretch md:p-7"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#fffaf0]/10 pb-5 md:block md:border-b-0 md:border-r md:pb-0 md:pr-7">
                  <p className="text-3xl font-medium leading-none text-[#d9ffd8]/82">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-[#eee7d7]/48 md:mt-5">
                    {item.period}
                  </p>
                </div>

                <div className="flex flex-col justify-center md:py-3">
                  <h3 className="text-[clamp(1.55rem,3vw,2.5rem)] font-medium leading-tight text-[#fffaf0]">
                    {item.title}
                  </h3>
                  <p className="mt-5 border-l border-[#d9ffd8]/35 pl-4 text-[15px] leading-8 text-[#eee7d7]/86">
                    {item.lead}
                  </p>
                  <p className="mt-6 whitespace-pre-line text-[15px] leading-8 text-[#d8d0bf]/72">
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

      <section id="future" className="bg-[#111d17] text-[#fffaf0]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[0.9fr_1fr] md:items-center md:py-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#263b2f]">
            <Image
              src="/history/future.jpg"
              alt="これからのざまくりプランツ"
              fill
              className="object-cover opacity-[0.82]"
              sizes="(min-width: 768px) 46vw, 100vw"
            />
            <div className="absolute inset-0 bg-[#07100b]/15" />
          </div>

          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              NEXT SEASON
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-medium leading-tight">
              これからが、本番です。
            </h2>
            <p className="mt-8 max-w-2xl whitespace-pre-line text-[15px] leading-8 text-[#eee7d7]/82">
              {`ただ売るだけの植物屋では終わりません。

品種を知る。違いが分かる。育てられる。

そして、自分の一株になる。

そこまでを届ける場所へ。ざまくりプランツは、まだ1年目。`}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
















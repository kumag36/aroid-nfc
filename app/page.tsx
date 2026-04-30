import Image from 'next/image'
import Link from 'next/link'

const history = [
  {
    title: '幼少期｜原点',
    image: '/history/start.jpg',
    text: `メダカ、観賞魚、爬虫類、昆虫、タランチュラ。

気づけば、常に生き物が身近にある環境で育っていました。

「どうすれば元気に育つのか」
「なぜ状態が変わるのか」

遊びの延長のようでいて、この頃からすでに観察と管理の感覚は培われていました。`,
  },
  {
    title: 'モンステラへの没入',
    image: '/history/plants.jpg',
    text: `タイコンステレーション、ホワイトタイガー、イエローマリリン、ホワイトモンスター。

希少品種に触れる中で、「ただのコレクション」では満足できなくなります。

環境、光、用土、管理。すべてが状態に直結する世界。

良い株とは何かを、自分の目で見極めるようになりました。`,
  },
  {
    title: 'ざまくりプランツ始動（0ヶ月目）',
    image: '/history/start.jpg',
    text: `神奈川県座間市。

平屋の軒先から、ざまくりプランツはスタートしました。

派手な店舗も、過剰な在庫もない。
あるのは「確実に良いと思える株だけ」。

小さくても、本気でやると決めた瞬間でした。`,
  },
  {
    title: 'イベント出店（3ヶ月目）',
    image: '/history/event.jpg',
    text: `最初に選んだのは現場。

ネットではなく、実際に見て、触れて、納得してもらう販売。

「状態いいですね」

その一言が、すべてを証明してくれました。`,
  },
  {
    title: '海外との接点（9ヶ月目）',
    image: '/history/overseas.jpg',
    text: `タイ・中国・ベトナム。

アジアを代表するナーセリーや、世界中のマニアが集まる現場に触れる。

持ち込まれる株のレベル、熱量、スピード感。

本物を扱う覚悟が、ここで一段上がりました。`,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3efe5] text-[#191a15] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <header className="absolute inset-x-0 top-0 z-30 px-5 py-5 text-[#fffaf0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-current text-[11px] tracking-[0.16em]">
              ZP
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.18em]">
                ざまくりプランツ
              </span>
              <span className="block text-[10px] tracking-[0.2em] opacity-75">
                ZAMAKURI PLANTS
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] tracking-[0.22em] md:flex">
            <Link href="/i/ZMK-000001">ZMK-000001</Link>
            <a href="#history">HISTORY</a>
            <a href="#future">FUTURE</a>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[92vh] overflow-hidden bg-[#08100c] text-[#fffaf0]">
        <Image
          src="/history/hero-botanical.png"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.58]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,7,0.94)_0%,rgba(9,15,11,0.76)_43%,rgba(9,15,11,0.2)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08100c] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-28">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            ZAMAKURI PLANTS HISTORY
          </p>
          <h1 className="max-w-4xl text-[clamp(2.6rem,7vw,6.4rem)] font-medium leading-[1.08] tracking-normal">
            植物と向き合う時間を、<span className="whitespace-nowrap">品位へ。</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#eee7d7]/85 md:text-lg md:leading-9">
            平屋の軒先から始まった小さな植物屋は、ひと鉢ごとの表情を見極め、
            全国の植物好きと静かにつながる場所へ育ちました。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#history"
              className="inline-flex min-h-12 min-w-48 items-center justify-center border border-[#b89558] bg-[#b89558] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d]"
            >
              年表を見る
            </a>
            <Link
              href="/i/ZMK-000001"
              className="inline-flex min-h-12 min-w-48 items-center justify-center border border-[#fffaf0]/35 px-6 text-sm font-semibold tracking-[0.16em]"
            >
              図鑑を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 border-b border-[#191a15]/10 px-5 py-20 md:grid-cols-[220px_1fr] md:py-28">
        <p className="text-xs font-bold tracking-[0.28em] text-[#8f5949]">SINCE 2024</p>
        <div className="max-w-4xl">
          <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-medium leading-tight">
            派手さではなく、確かな目利きで残るブランドへ。
          </h2>
          <p className="mt-8 text-[15px] leading-8 text-[#6a645b] md:text-lg md:leading-9">
            ざまくりプランツが大切にしているのは、植物の希少性だけではありません。
            育てる人の暮らしに馴染む姿、時間を重ねたときの美しさ、そして手渡すまでの
            ひとつひとつの判断。その積み重ねを、年表として見える形にしました。
          </p>
        </div>
      </section>

      <section id="history" className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="mb-14 grid gap-8 md:grid-cols-[1fr_420px] md:items-end">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#8f6f37]">
              CHRONOLOGY
            </p>
            <h2 className="text-[clamp(2.1rem,5vw,4.8rem)] font-medium leading-tight">
              ざまくりプランツ年表
            </h2>
          </div>
          <p className="text-[15px] leading-8 text-[#6a645b]">
            1年でここまで来た、小さな植物屋のリアル。販売記録ではなく、
            本気で植物と向き合ってきた時間の記録です。
          </p>
        </div>

        <div className="border-t border-[#191a15]/12">
          {history.map((item, index) => (
            <article
              key={item.title}
              className="group grid gap-8 border-b border-[#191a15]/12 py-10 md:grid-cols-[130px_minmax(0,0.82fr)_minmax(300px,0.9fr)] md:gap-12 md:py-14"
            >
              <p className="text-sm font-bold tracking-[0.18em] text-[#8f6f37]">
                {String(index + 1).padStart(2, '0')}
              </p>

              <div>
                <h3 className="text-[clamp(1.45rem,2.8vw,2.35rem)] font-medium leading-tight">
                  {item.title}
                </h3>
                <p className="mt-6 whitespace-pre-line text-[15px] leading-8 text-[#665f55]">
                  {item.text}
                </p>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#d9d3c7]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover grayscale-[18%] transition duration-700 group-hover:scale-[1.03]"
                  sizes="(min-width: 768px) 36vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050705]/35 to-transparent" />
              </div>
            </article>
          ))}
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
            <h2 className="text-[clamp(2rem,4.6vw,4.6rem)] font-medium leading-tight">
              これからが、本番です。
            </h2>
            <p className="mt-8 max-w-2xl whitespace-pre-line text-[15px] leading-8 text-[#eee7d7]/82 md:text-lg md:leading-9">
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

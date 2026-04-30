import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(circle_at_72%_18%,rgba(217,255,216,0.16),transparent_28%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 py-16 text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <section className="relative w-full max-w-4xl border border-[#fffaf0]/12 bg-[#08140f]/84 p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.32)] md:p-12">
        <div className="mx-auto mb-7 grid h-28 w-28 place-items-center rounded-full bg-[#d9ffd8] p-3 shadow-[0_22px_70px_rgba(0,0,0,0.28)] ring-1 ring-[#fffaf0]/40 md:h-36 md:w-36">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image src="/brand/zamakuri-logo.png" alt="ざまくりプランツ" fill className="object-cover" sizes="144px" />
          </div>
        </div>

        <p className="mb-4 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
          404 / LOST LEAF
        </p>
        <h1 className="text-[clamp(2.6rem,8vw,6.8rem)] font-medium leading-[1.02]">
          そのページ、
          <span className="block">まだ芽吹いてない。</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-8 text-[#d8d0bf]/80 md:text-lg md:leading-9">
          探してくれてありがとう。ここはまだ準備中の小さな鉢です。
          図鑑かトップに戻れば、いま育っているページたちに会えます。
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-3">
          <Link href="/dictionary" className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#d9ffd8] bg-[#d9ffd8] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d] transition duration-300 hover:-translate-y-0.5">
            図鑑へ戻る
          </Link>
          <Link href="/" className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#fffaf0]/24 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#fffaf0]/55">
            トップへ戻る
          </Link>
          <Link href="/register" className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#fffaf0]/14 bg-[#fffaf0]/6 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#b89558]/55">
            NFC登録へ
          </Link>
        </div>

        <div className="mt-10 border-t border-[#fffaf0]/10 pt-6 text-xs leading-6 text-[#d8d0bf]/58">
          Page not found. でも、これは終わりじゃなくて、これから育つ場所です。
        </div>
      </section>
    </main>
  )
}


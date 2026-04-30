import Link from 'next/link'
import { plants } from '@/lib/dictionary-data'

type DictionaryDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function DictionaryDetailPage({
  params,
}: DictionaryDetailPageProps) {
  const { slug } = await params
  const plant = plants.find((item) => item.slug === slug)

  if (!plant) {
    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_75%_20%,rgba(61,93,70,0.42),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] px-5 py-20 text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
        <section className="w-full max-w-3xl border border-[#fffaf0]/12 bg-[#08140f]/78 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.28)] md:p-12">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            DICTIONARY DATA NOT FOUND
          </p>
          <h1 className="text-[clamp(2.4rem,7vw,5.4rem)] font-medium leading-tight">
            まだ作ってなかった
            <span className="block">ごめんね😉テヘペロ</span>
          </h1>
          <p className="mt-7 text-[15px] leading-8 text-[#d8d0bf]/78 md:text-lg md:leading-9">
            この品種の詳細ページは、これから育てながら深くしていきます。
            図鑑一覧から、いま記録されている品種を見てください。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/dictionary"
              className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#b89558] bg-[#b89558] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d] transition duration-300 hover:-translate-y-0.5"
            >
              図鑑へ戻る
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#fffaf0]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#fffaf0]/55"
            >
              トップへ戻る
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_75%_20%,rgba(61,93,70,0.36),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] px-5 py-20 text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <section className="mx-auto max-w-5xl border border-[#fffaf0]/12 bg-[#08140f]/78 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.26)] md:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
          {plant.category}
        </p>
        <h1 className="text-[clamp(2.2rem,5vw,4.8rem)] font-medium leading-tight">
          {plant.displayName}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#d8d0bf]/82">
          和名 / 流通名：{plant.tradeName}
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {plant.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#fffaf0]/12 bg-[#fffaf0]/6 px-3 py-1 text-xs text-[#eee7d7]/76"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-[15px] leading-8 text-[#d8d0bf]/78 md:text-lg md:leading-9">
          {plant.description}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/dictionary"
            className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#b89558] bg-[#b89558] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d]"
          >
            図鑑へ戻る
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#fffaf0]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0]"
          >
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import { plants } from '@/lib/dictionary-data'

export const metadata = {
  title: '販売中 | ZAMAKURI.JP',
  description: 'ざまくりプランツで販売中または案内可能な株への入口。',
}

const salePlants = plants.slice(0, 9)

export default function ShopPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="販売中"
        title={
          <>
            欲しい一株へ
            <span className="block">迷わず進む。</span>
          </>
        }
        lead="図鑑で気になった株を、そのまま購入相談へ。販売状況は変動するため、気になる株は早めにお問い合わせください。"
        actions={
          <>
            <Link href="/notify" className="zmk-button zmk-button-primary">
              入荷通知
            </Link>
            <Link href="/dictionary" className="zmk-button text-[#fffef8]">
              図鑑を見る
            </Link>
          </>
        }
      />

      <section className="zmk-section">
        <div className="zmk-container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {salePlants.map((plant, index) => (
              <article key={plant.slug} className="zmk-card zmk-card-hover overflow-hidden">
                <div className="relative aspect-[4/3] bg-[#10291e]">
                  <Image
                    src="/history/hero-botanical.png"
                    alt=""
                    fill
                    className="object-cover opacity-75"
                    sizes="(min-width:1024px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,7,0.08),rgba(5,10,7,0.62))]" />
                  <p className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#10291e]">
                    一点もの
                  </p>
                </div>
                <div className="p-5">
                  <p className="zmk-eyebrow text-[11px]">{plant.category}</p>
                  <h2 className="mt-3 text-2xl text-[#10291e]">{plant.tradeName}</h2>
                  <p className="zmk-scientific mt-2 text-xl text-[#10291e]">{plant.displayName}</p>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#10291e]">価格</p>
                      <p className="text-3xl font-black text-[#10291e]">{index < 3 ? 'ASK' : '相談'}</p>
                    </div>
                    <p className="rounded-full bg-[#10291e] px-3 py-1 text-xs font-bold text-white">
                      残りわずか
                    </p>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link href={`/dictionary/${plant.slug}`} className="zmk-button min-w-0">
                      詳細
                    </Link>
                    <Link href={`/notify?plant=${encodeURIComponent(plant.slug)}`} className="zmk-button zmk-button-primary min-w-0">
                      購入相談
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

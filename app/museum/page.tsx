import BrandHeader from '@/app/components/BrandHeader'
import MuseumGallery from '@/app/museum/components/MuseumGallery'
import { listMuseumWorks } from '@/lib/museum-storage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '漫画部屋 | ZAMAKURI.JP',
  description: 'ざまくりプランツの漫画部屋。植物の育て方をマンガで読めます。',
}

export default async function MuseumPage() {
  const works = await listMuseumWorks().catch(() => [])

  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="zmk-public-hero px-5 pb-5 pt-28 sm:pb-10 sm:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="zmk-eyebrow mb-3">MANGA ROOM</p>
          <h1 className="text-[clamp(3.2rem,16vw,8rem)]">漫画部屋</h1>
          <p className="mx-auto mt-3 max-w-xl text-[14px] font-bold leading-7 text-[var(--zmk-ink-soft)] sm:text-[15px] sm:leading-8">
            植物のつまずきや世話のコツを、ゆるく読めるマンガで置いています。
          </p>
        </div>
      </section>
      <section className="bg-[var(--zmk-bg-card)] px-4 py-6 sm:px-5 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <MuseumGallery initialWorks={works} />
        </div>
      </section>
    </main>
  )
}

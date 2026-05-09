import Link from 'next/link'
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
      <section className="zmk-public-hero px-5 pb-10 pt-32 sm:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="zmk-eyebrow mb-4">MANGA ROOM</p>
          <h1>漫画部屋</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] font-bold leading-8 text-[var(--zmk-ink-soft)]">
            植物のつまずきや世話のコツを、ゆるく読めるマンガで置いています。
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/shokuchudoku" className="zmk-button zmk-button-primary">
              植中毒へ
            </Link>
            <Link href="/lab" className="zmk-button">
              音楽へ
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-[var(--zmk-bg-card)] px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <MuseumGallery initialWorks={works} />
        </div>
      </section>
    </main>
  )
}

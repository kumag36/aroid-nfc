import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import MuseumUploadForm from '../components/MuseumUploadForm'

export const metadata = {
  title: '漫画室 管理者入口 | ZAMAKURI.JP',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MuseumAdminPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="MANGA ADMIN"
        title={
          <>
            展示作品を
            <span className="block">追加する。</span>
          </>
        }
        lead="管理者だけの入口です。漫画ページをまとめて選ぶと、ざまくり漫画室でスマホ向けに縦読み展示されます。"
      />

      <section className="zmk-section">
        <div className="zmk-container max-w-3xl">
          <MuseumUploadForm />
          <div className="mt-8 text-center">
            <Link href="/museum" className="zmk-button">
              漫画室へ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

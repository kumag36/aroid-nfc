import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import MusicUploadForm from '../components/MusicUploadForm'

export const metadata = {
  title: '音楽室 管理者入口 | ZAMAKURI.JP',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MusicAdminPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="MUSIC ADMIN"
        title={
          <>
            音源を
            <span className="block">追加する。</span>
          </>
        }
        lead="管理者だけの入口です。ローカル音源とYouTube情報を登録すると、音楽室のラジカセプレイヤーへ反映されます。"
      />

      <section className="zmk-section">
        <div className="zmk-container max-w-3xl">
          <MusicUploadForm />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/admin" className="zmk-button">
              管理室へ戻る
            </Link>
            <Link href="/music" className="zmk-button">
              音楽室へ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

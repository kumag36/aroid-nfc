import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
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
    <main className="min-h-screen bg-[#06100b] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_18%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1fr)_420px] md:items-end">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              MUSIC ADMIN
            </p>
            <h1 className="max-w-5xl text-[clamp(2.3rem,6vw,5.4rem)] font-medium leading-[1.08] tracking-normal">
              音源を
              <span className="block">追加する。</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#eee7d7]/82 md:text-lg md:leading-9">
              ここは管理者だけの入口です。音源を選ぶと、音楽室のラジカセプレイヤーに表示されます。
            </p>
          </div>

          <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-5 text-[13px] leading-7 text-[#d8d0bf]/70">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">SETUP</p>
            <p className="mt-4">
              管理者パスワードとStorage bucket <span className="text-[#eaffdf]">music</span> を使って保存します。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <MusicUploadForm />
        <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs font-semibold tracking-[0.2em]">
          <Link href="/admin" className="text-[#d8d0bf]/62 transition hover:text-[#d9ffd8]">
            管理室へ戻る
          </Link>
          <Link href="/music" className="text-[#d8d0bf]/62 transition hover:text-[#d9ffd8]">
            音楽室へ戻る
          </Link>
        </div>
      </section>
    </main>
  )
}

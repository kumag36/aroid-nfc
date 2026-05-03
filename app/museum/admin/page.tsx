import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import MuseumUploadForm from '../components/MuseumUploadForm'

export const metadata = {
  title: '美術館 管理者入口 | ざまくりプランツ',
}

export default function MuseumAdminPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:var(--font-zamakuri)]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_18%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1fr)_420px] md:items-end">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              MUSEUM ADMIN
            </p>
            <h1 className="max-w-5xl text-[clamp(2.3rem,6vw,5.4rem)] font-medium leading-[1.08] tracking-normal">
              展示作品を
              <span className="block">追加する。</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#315244]/82 md:text-lg md:leading-9">
              ここは管理者だけの入口です。漫画ページをまとめて選ぶと、美術館で縦読み展示されます。
            </p>
          </div>

          <div className="border border-[#2c6a4b]/10 bg-white/86 p-5 text-[13px] leading-7 text-[#315244]/70">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">SETUP</p>
            <p className="mt-4">
              本番では <span className="text-[#eaffdf]">MUSEUM_ADMIN_PASSWORD</span> と
              <span className="text-[#eaffdf]"> SUPABASE_SERVICE_ROLE_KEY</span>、Storage bucket
              <span className="text-[#eaffdf]"> museum</span> を設定します。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <MuseumUploadForm />
        <div className="mt-8 text-center">
          <Link href="/museum" className="text-xs font-semibold tracking-[0.2em] text-[#315244]/62 transition hover:text-[#d9ffd8]">
            美術館へ戻る
          </Link>
        </div>
      </section>
    </main>
  )
}

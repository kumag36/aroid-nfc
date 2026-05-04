import Link from 'next/link'
import MuseumUploadForm from '../components/MuseumUploadForm'

export const metadata = {
  title: '漫画部屋管理 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default function MuseumAdminPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f8fbf2] px-4 py-5 text-[#10291e]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div><p className="zmk-eyebrow text-[10px] text-[#b89558]">MANGA ADMIN</p><h1 className="mt-1 text-2xl font-bold">漫画を追加</h1></div>
          <Link href="/admin" className="min-h-10 border border-[#10291e]/18 bg-white px-4 py-2 text-sm font-bold">管理へ</Link>
        </div>
        <MuseumUploadForm />
      </div>
    </main>
  )
}
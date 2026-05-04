import Link from 'next/link'
import NfcVerifyConsole from '@/app/nfc/verify/NfcVerifyConsole'

export const metadata = {
  title: 'NFC管理 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default function AdminNfcPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f8fbf2] px-4 py-5 text-[#10291e]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="zmk-eyebrow text-[10px] text-[#b89558]">NFC ADMIN</p>
            <h1 className="mt-1 text-2xl font-bold">NFC管理</h1>
          </div>
          <Link href="/admin" className="min-h-10 border border-[#10291e]/18 bg-white px-4 py-2 text-sm font-bold">管理へ</Link>
        </div>
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <Link href="/admin/items/new" className="min-h-11 border border-[#10291e]/12 bg-white px-4 py-3 text-sm font-bold">新規登録 ›</Link>
          <Link href="/admin/nfc/rewrite" className="min-h-11 border border-[#10291e]/12 bg-white px-4 py-3 text-sm font-bold">NFC書き込み ›</Link>
        </div>
        <NfcVerifyConsole />
      </div>
    </main>
  )
}
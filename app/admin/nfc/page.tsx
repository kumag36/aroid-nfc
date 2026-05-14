import Link from 'next/link'
import NfcVerifyConsole from '@/app/nfc/verify/NfcVerifyConsole'

export const metadata = {
  title: 'NFC管理 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default function AdminNfcPage() {
  return (
    <main className="zmk-admin-page px-4 py-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="zmk-eyebrow text-[10px]">NFC ADMIN</p>
            <h1 className="mt-1 text-2xl font-bold">NFC管理</h1>
          </div>
          <Link href="/admin" className="zmk-admin-link min-h-10 px-4 py-2 text-sm">管理へ</Link>
        </div>
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <Link href="/admin/nfc/individuals" className="zmk-admin-link min-h-11 px-4 py-3 text-sm">NFC個体タグ管理 ›</Link>
          <Link href="/admin/items/new" className="zmk-admin-link min-h-11 px-4 py-3 text-sm">新規登録 ›</Link>
          <Link href="/admin/nfc/rewrite" className="zmk-admin-link min-h-11 px-4 py-3 text-sm">NFC書き込み ›</Link>
        </div>
        <NfcVerifyConsole />
      </div>
    </main>
  )
}

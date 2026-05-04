import Link from 'next/link'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '管理 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

const links = [
  ['図鑑管理', '/dictionary/admin/images'],
  ['NFC管理', '/admin/nfc'],
  ['物置管理', '/music/admin'],
  ['ショップ情報', '/about'],
  ['設定', '/legal'],
]

export default function AdminPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f8fbf2] px-4 py-5 text-[#10291e]">
      <div className="mx-auto max-w-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="zmk-eyebrow text-[10px] text-[#b89558]">ADMIN</p>
            <h1 className="mt-1 text-2xl font-bold">管理</h1>
          </div>
          <LogoutButton />
        </div>
        <nav className="grid overflow-hidden border border-[#10291e]/12 bg-white">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="flex min-h-12 items-center justify-between border-b border-[#10291e]/10 px-4 text-[15px] font-bold last:border-b-0">
              <span>{label}</span>
              <span aria-hidden="true">›</span>
            </Link>
          ))}
        </nav>
        <p className="mt-4 text-xs leading-6 text-[#315244]">管理機能はログイン済みの端末だけ表示されます。公開サイトの導線からは入れません。</p>
      </div>
    </main>
  )
}
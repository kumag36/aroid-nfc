import Link from 'next/link'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '管理 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

const links = [
  ['アクセス解析', '/admin/analytics'],
  ['図鑑管理', '/dictionary/admin/images'],
  ['NFC管理', '/admin/nfc'],
  ['物置管理', '/music/admin'],
  ['感染度チェック兼認定審査', 'https://zamakuri.jp/shokuchudoku'],
  ['ショップ情報', '/about'],
  ['設定', '/legal'],
]

const auditLinks = [
  ['トップ', '/?audit=home'],
  ['ショップ情報', '/about?audit=about'],
  ['図鑑', '/dictionary?audit=mobile-firstview'],
  ['物置', '/lab?audit=lab'],
  ['感染度チェック兼認定審査', 'https://zamakuri.jp/shokuchudoku'],
  ['法務', '/legal?audit=legal'],
  ['ログイン画面', '/admin/login?audit=login'],
]

export default function AdminPage() {
  return (
    <main className="zmk-admin-page px-4 py-5">
      <div className="mx-auto max-w-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="zmk-eyebrow text-[10px]">ADMIN</p>
            <h1 className="mt-1 text-2xl font-bold">管理</h1>
          </div>
          <LogoutButton />
        </div>
        <section className="zmk-admin-alert mb-6 p-4">
          <p className="zmk-eyebrow text-[10px]">AUDIT LINKS</p>
          <h2 className="mt-1 text-2xl font-bold">検証リンク</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {auditLinks.map(([label, href]) => (
              <Link key={href} href={href} className="zmk-admin-link justify-center text-center text-sm">
                {label}
              </Link>
            ))}
          </div>
        </section>
        <nav className="zmk-admin-card grid overflow-hidden">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="zmk-admin-link border-x-0 border-t-0 last:border-b-0">
              <span>{label}</span>
              <span aria-hidden="true">›</span>
            </Link>
          ))}
        </nav>
        <p className="zmk-admin-muted mt-4 text-xs leading-6">管理機能はログイン済みの端末だけ表示されます。公開サイトの導線からは入れません。</p>
      </div>
    </main>
  )
}

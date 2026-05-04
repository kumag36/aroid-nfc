import Link from 'next/link'
import AdminLongPressLogo from './AdminLongPressLogo'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { href: '/about', label: 'ショップ情報' },
  { href: '/dictionary', label: '図鑑' },
  { href: '/lab', label: '物置' },
]

export default function BrandHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-[#2c6a4b]/12 bg-[#fffef8]/90 px-4 py-4 text-[#173b2a] shadow-[0_8px_24px_rgba(44,106,75,0.05)] backdrop-blur-sm sm:px-5 sm:py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <AdminLongPressLogo />
        <div className="flex shrink-0 items-center gap-3 md:gap-7">
          <nav className="zmk-nav hidden items-center gap-7 text-[12px] tracking-[0.08em] md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-[#173b2a]/78 transition hover:text-[#10291e]">
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
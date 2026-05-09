import Link from 'next/link'
import AdminLongPressLogo from './AdminLongPressLogo'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { href: '/shokuchudoku', label: '植中毒' },
  { href: '/lab', label: '音楽' },
  { href: '/museum', label: 'マンガ' },
]

export default function BrandHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-[#d9ffd8]/12 bg-[#07110c]/94 px-3 py-3 text-[#f7fbf1] shadow-[0_8px_24px_rgba(44,106,75,0.05)] backdrop-blur-sm sm:px-5 sm:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
        <AdminLongPressLogo />
        <div className="flex shrink-0 items-center gap-2 md:gap-7">
          <nav className="zmk-nav hidden items-center gap-7 text-[13px] font-extrabold md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-[#f7fbf1] transition hover:text-[#d9ffd8]">
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

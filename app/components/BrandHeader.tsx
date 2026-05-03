import Image from 'next/image'
import Link from 'next/link'
import MascotSprinkles from './MascotSprinkles'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { href: '/', label: 'トップ' },
  { href: '/dictionary', label: '図鑑' },
  { href: '/history', label: '歩み' },
  { href: '/owner', label: '店主より' },
  { href: '/museum', label: '漫画' },
  { href: '/music', label: '音楽室' },
  { href: '/nfc/verify', label: 'NFC' },
]

export default function BrandHeader() {
  return (
    <>
      <MascotSprinkles />
      <header className="absolute inset-x-0 top-0 z-30 border-b border-[#2c6a4b]/12 bg-[#fffef8]/80 px-4 py-4 text-[#173b2a] shadow-[0_12px_38px_rgba(44,106,75,0.06)] backdrop-blur-md sm:px-5 sm:py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="relative block h-12 w-11 shrink-0 overflow-hidden bg-white/40 sm:h-14 sm:w-12">
              <Image
                src="/brand/zamakuri-shop-logo.webp"
                alt="ざまくりプランツ"
                fill
                priority
                className="object-contain"
                sizes="56px"
              />
            </span>
            <span className="min-w-0">
              <span className="zmk-brand-title block truncate text-[13px] font-semibold tracking-[0.14em] sm:text-sm sm:tracking-[0.18em]">
                ざまくりプランツ
              </span>
              <span className="zmk-brand-subtitle block truncate text-[9px] tracking-[0.16em] opacity-75 sm:text-[10px] sm:tracking-[0.2em]">
                ZAMAKURI PLANTS
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-3 md:gap-8">
            <nav className="zmk-nav hidden items-center gap-8 text-[12px] tracking-[0.12em] md:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-[#173b2a]/72 transition hover:text-[#2c6a4b]">
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/admin"
              className="zmk-admin-link inline-flex min-h-9 items-center justify-center border border-[#2c6a4b]/22 bg-white/60 px-3 text-[10px] font-semibold tracking-[0.12em] text-[#173b2a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72)] transition hover:border-[#b89558]/55 hover:bg-[#fdfaf0] hover:text-[#10291e] sm:px-4 sm:text-[11px]"
            >
              管理
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  )
}

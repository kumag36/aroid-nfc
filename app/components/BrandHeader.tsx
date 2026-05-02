import Image from 'next/image'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'TOP' },
  { href: '/dictionary', label: 'DICTIONARY' },
  { href: '/history', label: 'HISTORY' },
  { href: '/museum', label: 'MUSEUM' },
  { href: '/music', label: 'MUSIC' },
  { href: '/nfc/verify', label: 'NFC LAB' },
]

export default function BrandHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-[#fffaf0]/10 bg-[#050806]/18 px-4 py-4 text-[#fffaf0] backdrop-blur-md sm:px-5 sm:py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#d9ffd8] shadow-[0_10px_30px_rgba(0,0,0,0.22)] ring-1 ring-[#fffaf0]/45 sm:h-12 sm:w-12">
            <Image src="/brand/zamakuri-logo.png" alt="" fill className="object-cover" sizes="48px" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold tracking-[0.14em] sm:text-sm sm:tracking-[0.18em]">ざまくりプランツ</span>
            <span className="block truncate text-[9px] tracking-[0.16em] opacity-75 sm:text-[10px] sm:tracking-[0.2em]">ZAMAKURI PLANTS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-[11px] tracking-[0.22em] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-[#fffaf0]/78 transition hover:text-[#d9ffd8]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

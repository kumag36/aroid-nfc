import Image from 'next/image'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'TOP' },
  { href: '/dictionary', label: 'DICTIONARY' },
  { href: '/register', label: 'NFC DB' },
]

export default function BrandHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-[#fffaf0]/10 bg-[#050806]/18 px-5 py-5 text-[#fffaf0] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative block h-12 w-12 overflow-hidden rounded-full bg-[#d9ffd8] shadow-[0_10px_30px_rgba(0,0,0,0.22)] ring-1 ring-[#fffaf0]/45">
            <Image src="/brand/zamakuri-logo.png" alt="" fill className="object-cover" sizes="48px" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-[0.18em]">ざまくりプランツ</span>
            <span className="block text-[10px] tracking-[0.2em] opacity-75">ZAMAKURI PLANTS</span>
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



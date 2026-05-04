'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/', label: 'ホーム' },
  { href: '/dictionary', label: '図鑑' },
  { href: '/nfc/verify', label: 'NFC', primary: true },
  { href: '/museum', label: '漫画' },
  { href: '/menu', label: 'メニュー' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#10291e]/12 bg-[#fffef8]/96 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_44px_rgba(16,41,30,0.12)] backdrop-blur-xl md:hidden" aria-label="スマホ下部ナビ">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} className={['flex min-h-11 items-center justify-center rounded-[10px] px-1 text-center text-[11px] font-bold leading-tight tracking-[0.02em]', item.primary ? 'bg-[#10291e] text-white shadow-[0_10px_26px_rgba(16,41,30,0.22)]' : active ? 'bg-[#e8f3df] text-[#10291e]' : 'text-[#10291e]'].join(' ')}>{item.label}</Link>
          )
        })}
      </div>
    </nav>
  )
}
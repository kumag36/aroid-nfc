'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/about', label: '店情報' },
  { href: '/dictionary', label: '図鑑' },
  { href: '/lab', label: '物置' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#10291e]/12 bg-[#fffef8]/96 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_26px_rgba(16,41,30,0.10)] backdrop-blur-md md:hidden" aria-label="スマホ下部ナビ">
      <div className="grid grid-cols-3 gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href} className={['flex min-h-11 items-center justify-center rounded-[8px] px-1 text-center text-[12px] font-extrabold leading-tight', active ? 'bg-[#123d2b] text-white' : 'text-[#10291e]'].join(' ')}>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
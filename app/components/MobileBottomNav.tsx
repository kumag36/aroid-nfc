'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/shokuchudoku', label: '植中毒' },
  { href: '/lab', label: '音楽' },
  { href: '/museum', label: 'マンガ' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="zmk-mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/96 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_26px_rgba(16,41,30,0.10)] backdrop-blur-md md:hidden" aria-label="スマホ下部ナビ">
      <div className="zmk-mobile-bottom-rail" aria-label="ページ選択">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href} className={['zmk-mobile-bottom-link', active ? 'zmk-mobile-bottom-link-active' : ''].join(' ')}>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

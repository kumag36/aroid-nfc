import Link from 'next/link'

const footerLinks = [
  { href: '/dictionary', label: '図鑑' },
  { href: '/nfc/verify', label: 'NFC' },
  { href: '/museum', label: '漫画部屋' },
  { href: '/about', label: 'ショップ情報' },
  { href: '/legal', label: '特定商取引法に基づく表記' },
  { href: '/legal/privacy', label: 'プライバシーポリシー' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#2c6a4b]/10 bg-[#fffef8] px-5 py-10 pb-24 text-[#143326] [font-family:var(--font-zamakuri)] dark:border-[#d9ffd8]/12 dark:bg-[#07110c] dark:text-[#f7fbf1] md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="zmk-brand-subtitle text-xs font-semibold tracking-[0.28em] text-[#b89558]">SINCE 2025 / ZAMAKURI PLANTS</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#315244]/78 dark:text-[#d9ffd8]/72">図鑑、NFC個体管理、漫画部屋を通して、植物との出会いを安心して楽しめるように整えています。</p>
        </div>
        <nav className="zmk-ui flex flex-wrap gap-x-5 gap-y-3 text-[11px] font-semibold tracking-[0.08em] text-[#315244]/78 dark:text-[#d9ffd8]/76">
          {footerLinks.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-[#b89558]">{item.label}</Link>)}
        </nav>
      </div>
    </footer>
  )
}
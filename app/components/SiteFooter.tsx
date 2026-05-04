import Link from 'next/link'

const footerLinks = [
  { href: '/about', label: 'ショップ情報' },
  { href: '/dictionary', label: '図鑑' },
  { href: '/lab', label: '物置' },
  { href: '/legal', label: '特定商取引法に基づく表記' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#2c6a4b]/10 bg-[#fffef8] px-5 py-8 pb-24 text-[#143326] [font-family:var(--font-zamakuri)] md:pb-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="zmk-brand-subtitle text-xs font-semibold tracking-[0.18em] text-[#b89558]">SINCE 2025 / ZAMAKURI PLANTS</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#315244]">完全予約制の小さな植物店。まずはショップ情報からご確認ください。</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-[12px] font-bold text-[#315244]">
          {footerLinks.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-[#10291e]">{item.label}</Link>)}
        </nav>
      </div>
    </footer>
  )
}
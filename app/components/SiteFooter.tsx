import Link from 'next/link'

const footerLinks = [
  { href: '/shokuchudoku', label: '植中毒' },
  { href: '/lab', label: '音楽' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--zmk-border)] bg-[var(--zmk-bg-card)] px-5 py-8 pb-24 text-[var(--zmk-ink)] md:pb-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="zmk-brand-subtitle text-xs font-semibold text-[var(--zmk-gold)]">SINCE 2025 / ZAMAKURI PLANTS</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--zmk-ink-soft)]">いま公開中の入口だけ置いています。</p>
        </div>
        <nav className="zmk-footer-link-rail" aria-label="ページ選択">
          {footerLinks.map((item) => <Link key={item.href} href={item.href} className="zmk-footer-link-button">{item.label}</Link>)}
        </nav>
      </div>
    </footer>
  )
}

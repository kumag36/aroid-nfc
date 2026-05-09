import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'トップ' },
  { href: '/shokuchudoku', label: '植中毒' },
  { href: '/lab', label: '音楽' },
  { href: '/museum', label: 'マンガ' },
]

const legalLinks = [
  { href: '/legal', label: '特商法表記' },
  { href: '/legal/privacy', label: 'プライバシー' },
  { href: '/legal/terms', label: '利用規約' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--zmk-border)] bg-[var(--zmk-bg-card)] px-5 py-8 pb-24 text-[var(--zmk-ink)] md:pb-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="zmk-brand-subtitle text-xs font-semibold text-[var(--zmk-gold)]">SINCE 2025 / ZAMAKURI PLANTS</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--zmk-ink-soft)]">いま公開中の入口だけ置いています。</p>
          <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-[var(--zmk-ink-soft)]" aria-label="法務リンク">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="underline underline-offset-4 hover:text-[var(--zmk-ink)]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="zmk-footer-link-rail" aria-label="ページ選択">
          {footerLinks.map((item) => <Link key={item.href} href={item.href} className="zmk-footer-link-button">{item.label}</Link>)}
        </nav>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import type { ReactNode } from 'react'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

type LegalShellProps = {
  eyebrow: string
  title: string
  lead: string
  children: ReactNode
}

export default function LegalShell({ eyebrow, title, lead, children }: LegalShellProps) {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero eyebrow={eyebrow} title={title} lead={lead} />

      <section className="zmk-section">
        <div className="zmk-container max-w-5xl">
          {children}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/" className="zmk-button zmk-button-primary">
              トップへ戻る
            </Link>
            <Link href="/legal" className="zmk-button">
              ショップ情報へ
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

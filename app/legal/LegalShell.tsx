import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import BrandHeader from '@/app/components/BrandHeader'

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
      <section className="zmk-hero">
        <Image
          src="/history/hero-botanical.png"
          alt=""
          fill
          priority
          className="zmk-hero-media"
          sizes="100vw"
        />
        <div className="zmk-hero-shade" />
        <div className="zmk-hero-fade" />
        <div className="zmk-container zmk-hero-body">
          <div className="zmk-rule" />
          <p className="zmk-eyebrow mb-5">{eyebrow}</p>
          <h1 className="zmk-title">{title}</h1>
          <p className="zmk-lead mt-8">{lead}</p>
        </div>
      </section>

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

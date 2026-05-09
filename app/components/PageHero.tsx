import Image from 'next/image'
import type { ReactNode } from 'react'

type PageHeroProps = {
  eyebrow: string
  title: ReactNode
  lead: ReactNode
  actions?: ReactNode
  imageSrc?: string
  feature?: ReactNode
}

export default function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  imageSrc = '/history/hero-botanical.png',
  feature,
}: PageHeroProps) {
  return (
    <section className="zmk-hero zmk-public-hero">
      <Image src={imageSrc} alt="" fill priority className="zmk-hero-media" sizes="100vw" />
      <div className="zmk-hero-shade" />
      <div className="zmk-hero-fade" />
      <div className="zmk-container zmk-hero-body">
        <div className={feature ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center' : ''}>
          <div>
            <div className="zmk-rule" />
            <p className="zmk-eyebrow mb-5">{eyebrow}</p>
            <h1 className="zmk-title">{title}</h1>
            <p className="zmk-lead mt-6">{lead}</p>
            {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {feature ? <div className="relative hidden lg:block">{feature}</div> : null}
        </div>
      </div>
    </section>
  )
}

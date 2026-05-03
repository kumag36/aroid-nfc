import Link from 'next/link'

type FixedCtaBarProps = {
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
}

export default function FixedCtaBar({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: FixedCtaBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-[4.2rem] z-40 px-3 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2 rounded-[14px] border border-[#10291e]/12 bg-[#fffef8]/96 p-2 shadow-[0_18px_48px_rgba(16,41,30,0.22)] backdrop-blur-xl">
        <Link
          href={primaryHref}
          className="flex min-h-12 items-center justify-center rounded-[10px] bg-[#10291e] px-3 text-sm font-bold text-white"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="flex min-h-12 items-center justify-center rounded-[10px] border border-[#10291e]/18 bg-white px-3 text-sm font-bold text-[#10291e]"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  )
}

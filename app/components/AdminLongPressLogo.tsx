'use client'

import type { MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLongPressLogo() {
  const router = useRouter()

  function handleDoubleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    router.push('/admin/login')
  }

  return (
    <Link
      href="/"
      onDoubleClick={handleDoubleClick}
      className="flex min-w-0 items-center gap-2 sm:gap-3"
      aria-label="ざまくりプランツ ホーム"
      title="ダブルクリックで管理ログイン"
    >
      <span className="relative block h-11 w-10 shrink-0 overflow-hidden bg-white/70 sm:h-13 sm:w-12">
        <Image
          src="/brand/zamakuri-shop-logo.webp"
          alt="ざまくりプランツ"
          fill
          priority
          className="object-contain"
          sizes="52px"
        />
      </span>
      <span className="min-w-0 max-w-[9.5rem] sm:max-w-none">
        <span className="zmk-brand-title block truncate text-[12px] font-extrabold tracking-[0.1em] sm:text-sm sm:tracking-[0.16em]">
          ざまくりプランツ
        </span>
        <span className="zmk-brand-subtitle block truncate text-[8px] tracking-[0.12em] opacity-75 sm:text-[10px] sm:tracking-[0.18em]">
          ZAMAKURI PLANTS
        </span>
      </span>
    </Link>
  )
}

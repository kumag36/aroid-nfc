'use client'

import type { MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLongPressLogo() {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressedRef = useRef(false)

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function startPress() {
    clearTimer()
    longPressedRef.current = false
    timerRef.current = setTimeout(() => {
      longPressedRef.current = true
      router.push('/admin/login')
    }, 2000)
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (longPressedRef.current) {
      event.preventDefault()
      longPressedRef.current = false
    }
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
      onPointerDown={startPress}
      onPointerUp={clearTimer}
      onPointerCancel={clearTimer}
      onPointerLeave={clearTimer}
      className="flex min-w-0 items-center gap-3"
      aria-label="ざまくりプランツ ホーム"
    >
      <span className="relative block h-12 w-11 shrink-0 overflow-hidden bg-white/40 sm:h-14 sm:w-12">
        <Image
          src="/brand/zamakuri-shop-logo.webp"
          alt="ざまくりプランツ"
          fill
          priority
          className="object-contain"
          sizes="56px"
        />
      </span>
      <span className="min-w-0">
        <span className="zmk-brand-title block truncate text-[13px] font-semibold tracking-[0.14em] sm:text-sm sm:tracking-[0.18em]">
          ざまくりプランツ
        </span>
        <span className="zmk-brand-subtitle block truncate text-[9px] tracking-[0.16em] opacity-75 sm:text-[10px] sm:tracking-[0.2em]">
          ZAMAKURI PLANTS
        </span>
      </span>
    </Link>
  )
}
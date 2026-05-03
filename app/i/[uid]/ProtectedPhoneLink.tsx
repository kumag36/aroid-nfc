'use client'

import { useMemo, useState } from 'react'

const phoneParts = ['070', '1511', '3690']
const mailParts = ['kumajuko', 'gmail.com']

export default function ProtectedPhoneLink() {
  const [revealed, setRevealed] = useState(false)
  const phoneNumber = useMemo(() => phoneParts.join('-'), [])
  const telNumber = useMemo(() => phoneParts.join(''), [])
  const emailAddress = useMemo(() => mailParts.join('@'), [])

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="inline-flex min-h-12 items-center justify-center border border-[#b89558] bg-[#b89558] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d] transition duration-300 hover:-translate-y-0.5"
      >
        管理局へ連絡する
      </button>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a
        href={`tel:${telNumber}`}
        className="inline-flex min-h-12 items-center justify-center border border-[#b89558] bg-[#b89558] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d] transition duration-300 hover:-translate-y-0.5"
        rel="nofollow"
      >
        {phoneNumber} に発信
      </a>
      <a
        href={`mailto:${emailAddress}?subject=${encodeURIComponent('植物ID登録依頼')}`}
        className="inline-flex min-h-12 items-center justify-center border border-[#2c6a4b]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#143326] transition duration-300 hover:-translate-y-0.5 hover:border-[#2c6a4b]/55"
        rel="nofollow"
      >
        Gmailで送る
      </a>
    </div>
  )
}

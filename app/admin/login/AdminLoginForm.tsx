'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json().catch(() => null)
    setIsSubmitting(false)

    if (!response.ok || !data?.ok) {
      setMessage(data?.message ?? 'ログインに失敗しました。メールとパスワードを確認してください。')
      return
    }

    router.replace(next.startsWith('/admin') ? next : '/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border border-[var(--zmk-border)] bg-white p-5 shadow-[0_18px_50px_rgba(16,41,30,0.08)]">
      <label className="grid gap-2 text-sm font-bold text-[#10291e]">
        メールアドレス
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 border border-[#10291e]/18 bg-[#fffef8] px-3 text-base outline-none focus:border-[#10291e]"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-[#10291e]">
        パスワード
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 border border-[#10291e]/18 bg-[#fffef8] px-3 text-base outline-none focus:border-[#10291e]"
          required
        />
      </label>
      {message ? <p className="text-sm font-bold text-red-700">{message}</p> : null}
      <button type="submit" disabled={isSubmitting} className="zmk-button zmk-button-primary w-full disabled:opacity-60">
        {isSubmitting ? '確認中...' : 'ログイン'}
      </button>
    </form>
  )
}
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

    router.replace(next.startsWith('/') && !next.startsWith('//') ? next : '/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="zmk-admin-card grid gap-4 p-5">
      <label className="zmk-admin-label grid gap-2">
        メールアドレス
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="zmk-admin-input text-base"
          required
        />
      </label>
      <label className="zmk-admin-label grid gap-2">
        パスワード
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="zmk-admin-input text-base"
          required
        />
      </label>
      {message ? <p className="zmk-admin-error text-sm font-bold">{message}</p> : null}
      <button type="submit" disabled={isSubmitting} className="zmk-button zmk-button-primary w-full disabled:opacity-60">
        {isSubmitting ? '確認中...' : 'ログイン'}
      </button>
    </form>
  )
}

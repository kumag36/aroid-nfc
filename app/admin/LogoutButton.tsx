'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <button type="button" onClick={logout} className="min-h-10 border border-[#10291e]/18 bg-white px-4 text-sm font-bold text-[#10291e]">
      ログアウト
    </button>
  )
}
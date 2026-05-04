import { Suspense } from 'react'
import BrandHeader from '@/app/components/BrandHeader'
import AdminLoginForm from './AdminLoginForm'

export const metadata = {
  title: '管理ログイン | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <main className="zmk-page bg-[#f8fbf2]">
      <BrandHeader />
      <section className="px-5 pb-16 pt-32 sm:pt-40">
        <div className="mx-auto grid max-w-md gap-6">
          <div>
            <p className="zmk-eyebrow mb-4 text-[#b89558]">ADMIN LOGIN</p>
            <h1 className="text-4xl font-bold text-[#10291e]">管理ログイン</h1>
            <p className="mt-4 text-sm leading-7 text-[#315244]">
              管理機能はログイン後に表示します。Supabase Auth のメールとパスワードで入室してください。
            </p>
          </div>
          <Suspense fallback={<div className="border border-[#2c6a4b]/12 bg-white p-5 text-sm text-[#173b2a]">読み込み中です。</div>}>
            <AdminLoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
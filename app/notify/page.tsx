import { redirect } from 'next/navigation'

export const metadata = {
  title: 'お問い合わせ | ZAMAKURI.JP',
  robots: { index: false, follow: true },
}

export default function NotifyPage() {
  redirect('/about')
}
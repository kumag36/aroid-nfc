import { redirect } from 'next/navigation'

export const metadata = {
  title: '図鑑 | ZAMAKURI.JP',
  robots: { index: false, follow: true },
}

export default function ShopPage() {
  redirect('/dictionary')
}
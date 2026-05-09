import { notFound } from 'next/navigation'

export const metadata = {
  title: 'ヒストリー準備中 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default function HistoryPage() {
  notFound()
}

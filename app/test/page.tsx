import { notFound } from 'next/navigation'

export const metadata = {
  title: '非公開 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default function Test() {
  notFound()
}

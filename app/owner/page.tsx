import { notFound } from 'next/navigation'

export const metadata = {
  title: '店主より | ZAMAKURI.JP',
  description:
    '2025年6月の開業から走り続けた11か月を振り返る、ざまくりプランツ店主からのご挨拶。',
  robots: { index: false, follow: false },
}

export default function OwnerMessagePage() {
  notFound()
}

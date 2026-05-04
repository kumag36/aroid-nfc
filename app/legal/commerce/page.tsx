import { redirect } from 'next/navigation'

export const metadata = {
  title: '特定商取引法に基づく表記 | ZAMAKURI.JP',
}

export default function CommercePage() {
  redirect('/legal')
}
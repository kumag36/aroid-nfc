import { redirect } from 'next/navigation'

export const metadata = {
  title: 'ショップ情報 | ZAMAKURI.JP',
}

export default function ShopInfoAliasPage() {
  redirect('/about')
}

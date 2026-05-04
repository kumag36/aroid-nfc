import { redirect } from 'next/navigation'

type PageProps = { searchParams?: Promise<{ id?: string }> }

export const metadata = {
  title: 'NFC登録 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default async function AdminNfcRegisterPage({ searchParams }: PageProps) {
  const params = await searchParams
  const suffix = params?.id ? `?id=${encodeURIComponent(params.id)}` : ''
  redirect(`/admin/items/new${suffix}`)
}
import { redirect } from 'next/navigation'

type Props = { searchParams?: Promise<{ uid?: string; id?: string }> }
export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams
  const id = params?.id ?? params?.uid
  redirect(id ? `/admin/items/new?id=${encodeURIComponent(id)}` : '/admin/items/new')
}
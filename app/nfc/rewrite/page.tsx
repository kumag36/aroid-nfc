import { redirect } from 'next/navigation'

type Props = { searchParams?: Promise<{ id?: string }> }
export default async function NfcRewritePage({ searchParams }: Props) {
  const params = await searchParams
  const suffix = params?.id ? `?id=${encodeURIComponent(params.id)}` : ''
  redirect(`/admin/nfc/rewrite${suffix}`)
}
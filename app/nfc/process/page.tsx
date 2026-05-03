import { redirect } from 'next/navigation'
import { fetchNfcItem, normalizeNfcId } from '@/lib/nfc-items'

type NfcProcessPageProps = {
  searchParams?: Promise<{
    id?: string
    uid?: string
    legacy?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function NfcProcessPage({ searchParams }: NfcProcessPageProps) {
  const params = await searchParams
  const rawId = params?.id ?? params?.uid ?? ''
  const id = normalizeNfcId(rawId)

  if (!id) {
    redirect('/nfc/rewrite')
  }

  if (params?.legacy === '1' || rawId !== id || !rawId.startsWith('ZMK-')) {
    redirect(`/nfc/rewrite?id=${encodeURIComponent(id)}`)
  }

  const result = await fetchNfcItem(id)

  if (result.status === 'registered') {
    redirect(`/i/${encodeURIComponent(id)}`)
  }

  redirect(`/admin/items/new?id=${encodeURIComponent(id)}`)
}

import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LegacyNfcPage({ params }) {
  const { uid } = await params
  redirect(`/i/${uid}`)
}

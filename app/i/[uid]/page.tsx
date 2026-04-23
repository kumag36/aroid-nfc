import { redirect } from 'next/navigation'

export default async function Page(props: any) {
  const params = await props.params
  const uid = params.uid

  const res = await fetch(
    `https://wasawygnvsvolkdrfjgs.supabase.co/rest/v1/items?select=slug&id=eq.${uid}`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      cache: 'no-store'
    }
  )

  const data = await res.json()

  if (!data.length) {
    return <div>UID not found</div>
  }

  redirect(`/plant/${data[0].slug}`)
}
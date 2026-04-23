import { redirect } from 'next/navigation'

export default async function Page(props: any) {
  const { uid } = await props.params

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/items?id=eq.${uid}`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    }
  )

  const data = await res.json()

  if (!data.length) {
    return <div>UID not found</div>
  }

  // とりあえず名前表示（確認用）
  return (
    <div>
      <h1>{data[0].name_en}</h1>
      <p>{data[0].name_jp}</p>
    </div>
  )
}
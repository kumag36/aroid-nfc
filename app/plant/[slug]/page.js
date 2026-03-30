import { createClient } from '@supabase/supabase-js'

export default async function Page({ params }) {
  const { slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data } = await supabase
    .from('plants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) return <div>データなし</div>

  const q = encodeURIComponent(data.name)
  const googleUrl = "https://www.google.com/search?tbm=isch&q=" + q

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name}</h1>

      <a href={googleUrl} target="_blank" rel="noopener noreferrer">
        🔍 画像検索（Google）
      </a>
    </div>
  )
}

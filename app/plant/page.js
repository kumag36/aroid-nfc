import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data } = await supabase
    .from('plants')
    .select('*')

  return (
    <div style={{ padding: 20 }}>
      <h1>図鑑一覧</h1>

      {data?.map((p) => (
        <Link key={p.slug} href={"/plant/" + p.slug}>
          <div style={{ marginBottom: 20 }}>
            <h3>{p.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

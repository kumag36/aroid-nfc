export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data } = await supabase
    .from('plants')
    .select('*')

  return (
    <div>
      <h1>図鑑一覧</h1>
      {data?.map((p) => (
        <div key={p.slug}>
          {p.name}
        </div>
      ))}
    </div>
  )
} 

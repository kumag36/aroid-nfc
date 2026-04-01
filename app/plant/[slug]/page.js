import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  const { slug } = params

  const { data } = await supabase
    .from('plants')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!data) {
    return <div style={{ color: '#fff' }}>データなし</div>
  }

  return (
    <main style={{
      background: '#020617',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff'
    }}>
      <h1>{data.name}</h1>
    </main>
  )
}

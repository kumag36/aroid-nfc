import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  const { slug } = params

  const { data } = await supabase
    .from('plants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) {
    return <div style={{ color: '#fff' }}>Not found</div>
  }

  const googleUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(data.name)}`

  return (
    <main style={{
      background: '#020617',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>
        {data.name}
      </h1>

      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
        {data.description}
      </p>

      <a
        href={googleUrl}
        target="_blank"
        style={{
          display: 'inline-block',
          background: '#22c55e',
          padding: '10px 16px',
          borderRadius: '8px',
          color: '#000',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}
      >
        🔍 画像を見る
      </a>
    </main>
  )
}

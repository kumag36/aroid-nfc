import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { data } = await supabase
    .from('nfc_tags')
    .select('*')

  return (
    <main style={{
      background: '#020617',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff'
    }}>
      <h1>図鑑一覧</h1>

      {data?.map(p => (
        <a key={p.id} href={`/plant/${p.slug}`} style={{
          display: 'block',
          background: '#0f172a',
          padding: '16px',
          marginBottom: '12px',
          borderRadius: '12px',
          color: '#fff',
          textDecoration: 'none'
        }}>
          🌿 {p.name}
        </a>
      ))}
    </main>
  )
}

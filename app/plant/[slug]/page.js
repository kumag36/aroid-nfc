export const dynamic = 'force-dynamic'

const dummy = [
  { name: 'Monstera Albo', slug: 'monstera-albo' },
  { name: 'Thai Constellation', slug: 'thai-con' },
  { name: 'Mint', slug: 'mint' }
]

export default function Page() {
  return (
    <main style={{
      background: '#020617',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        図鑑一覧
      </h1>

      {dummy.map(p => (
        <a key={p.slug} href={`/plant/${p.slug}`} style={{
          display: 'block',
          background: '#0f172a',
          padding: '16px',
          marginBottom: '12px',
          borderRadius: '10px',
          textDecoration: 'none',
          color: '#fff'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            🌿 {p.name}
          </div>

          <div style={{
            fontSize: '12px',
            color: '#94a3b8',
            marginTop: '4px'
          }}>
            詳細を見る →
          </div>
        </a>
      ))}
    </main>
  )
}

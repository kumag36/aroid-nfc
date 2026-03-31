export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main style={{
      background: '#0f172a',
      minHeight: '100vh',
      color: '#fff',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        ざまくりプランツ図鑑
      </h1>

      <a href="/plant" style={{
        display: 'inline-block',
        background: '#22c55e',
        padding: '12px 20px',
        borderRadius: '8px',
        color: '#000',
        fontWeight: 'bold',
        textDecoration: 'none'
      }}>
        図鑑を見る
      </a>
    </main>
  )
}

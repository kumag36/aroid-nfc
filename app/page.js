export default function Page() {
  return (
    <div style={{
      background: '#e6f7ff',
      minHeight: '100vh',
      padding: 20,
      textAlign: 'center'
    }}>
      
      <h1 style={{ fontSize: 32 }}>🌱 しょくぶつずかん</h1>

      <p>みたい しょくぶつを えらんでね！</p>

      <a href="/plant/test" style={{
        display: 'block',
        marginTop: 30,
        background: '#4CAF50',
        color: 'white',
        padding: '20px',
        borderRadius: '15px',
        fontSize: '20px',
        textDecoration: 'none'
      }}>
        🌿 テストページ
      </a>

    </div>
  )
}

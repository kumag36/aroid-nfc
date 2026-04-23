import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>ざまくり図鑑</h1>

      <p>テストリンク</p>

      <Link href="/i/ZMK-000001">
        ZMK-000001
      </Link>
    </main>
  )
}
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>🌱 アロイド図鑑</h1>

      <Link href="/plant">
        👉 図鑑を見る
      </Link>
    </div>
  )
}

import Link from 'next/link'

export default async function Home() {
  const res = await fetch("https://wasawygnvsvolkdrfjgs.supabase.co/rest/v1/plants?select=*", {
    headers: {
      apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    cache: "no-store"
  })

  const plants = await res.json()

  return (
    <div style={{ padding: 20 }}>
      <h1>図鑑一覧</h1>

      {plants.map((plant) => (
        <Link key={plant.slug} href={/plant/}>
          <div style={{
            padding: 16,
            marginBottom: 10,
            background: '#0f172a',
            borderRadius: 10,
            cursor: 'pointer'
          }}>
            🌿 {plant.name}
          </div>
        </Link>
      ))}
    </div>
  )
}

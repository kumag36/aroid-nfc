import Link from 'next/link'

export default async function Home() {
  const res = await fetch("https://wasawygnvsvolkdrfjgs.supabase.co/rest/v1/plants?select=*", {
    headers: {
      apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2F3eWdudnN2b2xrZHJmamdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjI0ODcsImV4cCI6MjA5MDQzODQ4N30.28yMkwHVNgbhUTuQzyDej8SbTLDeumYJHo06YPeNVNc",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2F3eWdudnN2b2xrZHJmamdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjI0ODcsImV4cCI6MjA5MDQzODQ4N30.28yMkwHVNgbhUTuQzyDej8SbTLDeumYJHo06YPeNVNc"
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

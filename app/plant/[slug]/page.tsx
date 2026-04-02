export default async function Page({ params }) {

  const slug = params.slug

  const res = await fetch(
    https://wasawygnvsvolkdrfjgs.supabase.co/rest/v1/plants?select=*&slug=eq.,
    {
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIs...",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIs..."
      },
      cache: "no-store"
    }
  )

  const data = await res.json()

  if (!data || data.length === 0) {
    return <div>Not Found</div>
  }

  const plant = data[0]

  const googleUrl = https://www.google.com/search?tbm=isch&q=

  return (
    <div style={{ padding: 20 }}>
      <h1>{plant.name}</h1>
      <p>{plant.scientific_name}</p>

      <a href={googleUrl} target="_blank">
        🔍 Google画像で見る
      </a>
    </div>
  )
}

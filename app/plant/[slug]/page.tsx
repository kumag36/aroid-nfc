import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://wasawygnvsvolkdrfjgs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2F3eWdudnN2b2xrZHJmamdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjI0ODcsImV4cCI6MjA5MDQzODQ4N30.28yMkwHVNgbhUTuQzyDej8SbTLDeumYJHo06YPeNVNc"
)

export default async function Page({ params }: { params: { slug: string } }) {

  const { data } = await supabase
    .from('plants')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!data) {
    return <div>Not Found</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name}</h1>
      <p>{data.scientific_name}</p>
    </div>
  )
}

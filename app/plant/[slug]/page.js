export const dynamic = 'force-dynamic'

export default function Page({ params }) {
  return (
    <div style={{ color: '#fff', padding: '20px' }}>
      slug: {params.slug}
    </div>
  )
}

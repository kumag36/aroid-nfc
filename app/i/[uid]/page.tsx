import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

type PageProps = {
  params: Promise<{ uid: string }>
}

type ItemRow = {
  id?: string
  uid?: string
  plant_id?: string
  name?: string | null
  name_en?: string | null
  scientific_name?: string | null
  name_jp?: string | null
  trade_name?: string | null
  slug?: string | null
}

export const dynamic = 'force-dynamic'

async function fetchItem(uid: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return { status: 'error' as const, code: 'SUPABASE_ENV_MISSING', message: 'Debug: fetch failed', item: null }

  try {
    const endpoint = new URL('/rest/v1/items', supabaseUrl)
    endpoint.searchParams.set('id', `eq.${uid}`)
    endpoint.searchParams.set('select', '*')
    const response = await fetch(endpoint.toString(), {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
      cache: 'no-store',
    })
    if (!response.ok) return { status: 'error' as const, code: `SUPABASE_HTTP_${response.status}`, message: 'Debug: fetch failed', item: null }
    const rows = (await response.json()) as ItemRow[]
    if (!rows[0]) return { status: 'not_registered' as const, code: 'PLANT_ID_NOT_REGISTERED', message: 'この植物IDは登録されておりません。管理局にお問い合わせください。', item: null }
    return { status: 'registered' as const, code: 'PLANT_ID_REGISTERED', message: 'この植物IDは登録済みです。', item: rows[0] }
  } catch {
    return { status: 'error' as const, code: 'FETCH_FAILED', message: 'Debug: fetch failed', item: null }
  }
}

function DataRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="grid gap-1 border-b border-[var(--zmk-border)] py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-5">
      <dt className="zmk-eyebrow text-[11px]">{label}</dt>
      <dd className="text-[15px] font-bold leading-7 text-[var(--zmk-ink)]">{value}</dd>
    </div>
  )
}

export default async function IndividualPage({ params }: PageProps) {
  const { uid } = await params
  const normalizedUid = decodeURIComponent(uid).trim().toUpperCase()
  const result = await fetchItem(normalizedUid)
  const item = result.item
  const displayName = item?.name_jp || item?.trade_name || item?.name_en || item?.scientific_name || item?.name || normalizedUid
  const contactHref = `mailto:kumajuko@gmail.com?subject=${encodeURIComponent(`植物ID問い合わせ: ${normalizedUid}`)}`

  if (!item) {
    return (
      <main className="zmk-page">
        <BrandHeader />
        <PageHero
          eyebrow="PLANT ID CHECK"
          title={<>この植物IDは<span className="block">登録されておりません。</span></>}
          lead={`${result.message} エラーコード: ${result.code} / メッセージ: ${result.message}`}
          actions={
            <>
              <a href={contactHref} className="zmk-button zmk-button-primary">Gmailで問い合わせ</a>
              <Link href="/about" className="zmk-button">ショップ情報へ</Link>
            </>
          }
        />
        <section className="zmk-section">
          <div className="zmk-container zmk-card p-5 sm:p-7">
            <p className="zmk-eyebrow mb-4">DEBUG</p>
            <dl>
              <DataRow label="植物ID" value={normalizedUid} />
              <DataRow label="本来のエラーコード" value={result.code} />
              <DataRow label="メッセージ" value={result.message} />
            </dl>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="PLANT RECORD"
        title={displayName}
        lead={`NFCタグから呼び出された個体管理ページです。植物ID ${normalizedUid} の基本情報を表示しています。`}
        actions={
          <>
            {item.slug ? <Link href={`/dictionary/${item.slug}`} className="zmk-button zmk-button-primary">図鑑詳細へ</Link> : null}
            <Link href="/dictionary" className="zmk-button">図鑑へ戻る</Link>
          </>
        }
      />
      <section className="zmk-section">
        <div className="zmk-container zmk-card p-5 sm:p-7">
          <p className="zmk-eyebrow mb-5">INDIVIDUAL DATA</p>
          <dl>
            <DataRow label="植物ID" value={normalizedUid} />
            <DataRow label="表示名" value={displayName} />
            <DataRow label="学名" value={item.name_en || item.scientific_name} />
            <DataRow label="流通名" value={item.trade_name || item.name_jp} />
            <DataRow label="図鑑Slug" value={item.slug} />
          </dl>
        </div>
      </section>
    </main>
  )
}
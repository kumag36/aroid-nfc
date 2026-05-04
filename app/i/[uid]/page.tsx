import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import ProtectedPhoneLink from './ProtectedPhoneLink'

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

type NfcError = {
  code: string
  message: string
}

type IndividualPageProps = {
  params: Promise<{
    uid: string
  }>
}

export const dynamic = 'force-dynamic'

function normalizeItem(row: ItemRow): ItemRow {
  return {
    id: row.id ?? row.uid ?? row.plant_id,
    name_en: row.name_en ?? row.scientific_name ?? row.name,
    name_jp: row.name_jp ?? row.trade_name,
    slug: row.slug,
  }
}

async function fetchItem(uid: string): Promise<{
  item: ItemRow | null
  error: NfcError | null
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      item: null,
      error: {
        code: 'SUPABASE_ENV_MISSING',
        message: 'Debug: Supabase environment variables are missing.',
      },
    }
  }

  try {
    const endpoint = new URL('/rest/v1/items', supabaseUrl)
    endpoint.searchParams.set('id', `eq.${uid}`)
    endpoint.searchParams.set('select', '*')

    const response = await fetch(endpoint.toString(), {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      return {
        item: null,
        error: {
          code: `SUPABASE_HTTP_${response.status}`,
          message: detail
            ? `Debug: Supabase returned ${response.status}: ${detail}`
            : `Debug: Supabase returned ${response.status}.`,
        },
      }
    }

    const data = (await response.json()) as ItemRow[]

    if (!data[0]) {
      return {
        item: null,
        error: {
          code: 'PLANT_ID_NOT_REGISTERED',
          message: `Debug: plant id ${uid} is not registered.`,
        },
      }
    }

    return { item: normalizeItem(data[0]), error: null }
  } catch {
    return {
      item: null,
      error: {
        code: 'FETCH_FAILED',
        message: 'Debug: fetch failed',
      },
    }
  }
}

function ErrorDetail({ error }: { error: NfcError | null }) {
  return (
    <div className="zmk-card mt-8 p-5 text-xs leading-6">
      <p className="zmk-eyebrow text-[11px]">ERROR DETAIL</p>
      <dl className="zmk-muted mt-4 grid gap-2 sm:grid-cols-[150px_1fr]">
        <dt>本来のエラーコード</dt>
        <dd>{error?.code ?? 'UNKNOWN_ERROR'}</dd>
        <dt>メッセージ</dt>
        <dd>{error?.message ?? 'Debug: unknown error'}</dd>
      </dl>
    </div>
  )
}

function EmptyState({ uid, error }: { uid: string; error: NfcError | null }) {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow={`NFC DATA NOT REGISTERED / ${uid}`}
        title={
          <>
            この植物IDは
            <span className="block">登録されておりません。</span>
          </>
        }
        lead="管理局にお問い合わせください。登録画面から植物IDと個体情報を送ると、このページに個体管理情報が表示されます。"
        actions={
          <>
            <ProtectedPhoneLink />
            <Link href={`/admin/items/new?id=${encodeURIComponent(uid)}`} className="zmk-button zmk-button-primary">
              登録画面へ進む
            </Link>
            <Link href="/dictionary" className="zmk-button text-[#fffef8]">
              図鑑を見る
            </Link>
            <Link href="/" className="zmk-button text-[#fffef8]">
              トップへ戻る
            </Link>
          </>
        }
      />

      <section className="zmk-section">
        <div className="zmk-container max-w-4xl">
          <ErrorDetail error={error} />
        </div>
      </section>
    </main>
  )
}

export default async function Page({ params }: IndividualPageProps) {
  const { uid } = await params
  const { item, error } = await fetchItem(uid)

  if (!item) {
    return <EmptyState uid={uid} error={error} />
  }

  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow={`NFC INDIVIDUAL / ${uid}`}
        title={item.name_en || item.name_jp || uid}
        lead={
          item.name_jp
            ? `和名 / 流通名：${item.name_jp}`
            : 'NFCタグから呼び出された個体管理ページです。'
        }
        actions={
          <>
            {item.slug ? (
              <Link href={`/dictionary/${item.slug}`} className="zmk-button zmk-button-primary">
                図鑑詳細へ
              </Link>
            ) : null}
            <Link href="/dictionary" className="zmk-button text-[#fffef8]">
              図鑑へ戻る
            </Link>
          </>
        }
      />
    </main>
  )
}

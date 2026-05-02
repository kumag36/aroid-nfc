import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
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
          message: detail ? `Debug: Supabase returned ${response.status}: ${detail}` : `Debug: Supabase returned ${response.status}.`,
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

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]"
    >
      {children}
    </Link>
  )
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center border border-[#fffaf0]/22 bg-[#050806]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#d9ffd8]/55"
    >
      {children}
    </Link>
  )
}

function EmptyState({ uid, error }: { uid: string; error: NfcError | null }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_75%_20%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-32">
        <div className="w-full max-w-4xl border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.28)] md:p-12">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            NFC DATA NOT REGISTERED / {uid}
          </p>
          <h1 className="text-[clamp(2.2rem,6vw,4.6rem)] font-medium leading-tight">
            この植物IDは登録されておりません。
            <span className="block">管理局にお問い合わせください。</span>
          </h1>
          <div className="mt-8 border-l border-[#d9ffd8]/35 pl-5 text-[15px] leading-8 text-[#d8d0bf]/80 md:text-lg md:leading-9">
            <p>登録画面から植物IDと個体情報を登録すると、このページに個体管理情報が表示されます。</p>
            <p className="mt-3">登録時は NFC ID: {uid} を管理局へ共有してください。</p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <ProtectedPhoneLink />
            <PrimaryLink href={`/register?uid=${encodeURIComponent(uid)}`}>登録申請へ進む</PrimaryLink>
            <SecondaryLink href="/dictionary">図鑑を見る</SecondaryLink>
            <SecondaryLink href="/">トップへ戻る</SecondaryLink>
          </div>

          <div className="mt-8 border border-[#fffaf0]/10 bg-[#fffaf0]/5 p-4 text-xs leading-6 text-[#d8d0bf]/64">
            <p className="font-semibold tracking-[0.16em] text-[#b89558]">ERROR DETAIL</p>
            <dl className="mt-3 grid gap-2 sm:grid-cols-[140px_1fr]">
              <dt>本来のエラーコード</dt>
              <dd>{error?.code ?? 'UNKNOWN_ERROR'}</dd>
              <dt>メッセージ</dt>
              <dd>{error?.message ?? 'Debug: unknown error'}</dd>
            </dl>
          </div>
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_75%_20%,rgba(217,255,216,0.10),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-32">
        <div className="w-full max-w-5xl border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.26)] md:p-12">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            NFC INDIVIDUAL / {uid}
          </p>
          <h1 className="text-[clamp(2.2rem,5vw,4.8rem)] font-medium leading-tight">
            {item.name_en || item.name_jp || uid}
          </h1>
          {item.name_jp && (
            <p className="mt-5 text-lg leading-8 text-[#d8d0bf]/82">
              和名 / 流通名：{item.name_jp}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            {item.slug && <PrimaryLink href={`/dictionary/${item.slug}`}>図鑑詳細へ</PrimaryLink>}
            <SecondaryLink href="/dictionary">図鑑へ戻る</SecondaryLink>
          </div>
        </div>
      </section>
    </main>
  )
}

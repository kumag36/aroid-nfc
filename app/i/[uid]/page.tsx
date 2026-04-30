import Link from 'next/link'
import ProtectedPhoneLink from './ProtectedPhoneLink'

type ItemRow = {
  id?: string
  name_en?: string | null
  name_jp?: string | null
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
    endpoint.searchParams.set('select', 'id,name_en,name_jp,slug')

    const response = await fetch(endpoint.toString(), {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        item: null,
        error: {
          code: `SUPABASE_HTTP_${response.status}`,
          message: `Debug: Supabase returned ${response.status}.`,
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

    return { item: data[0], error: null }
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

function EmptyState({ uid, error }: { uid: string; error: NfcError | null }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_75%_20%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] px-5 py-20 text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <section className="w-full max-w-3xl border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.28)] md:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
          NFC DATA NOT REGISTERED / {uid}
        </p>
        <h1 className="text-[clamp(2.2rem,6vw,4.6rem)] font-medium leading-tight">
          この植物IDは登録されておりません。
          <span className="block">管理局にお問い合わせください。</span>
        </h1>
        <div className="mt-8 border-l border-[#b89558]/70 pl-5 text-[15px] leading-8 text-[#d8d0bf]/80 md:text-lg md:leading-9">
          <p>登録画面から植物IDと個体情報を登録すると、このページに個体管理情報が表示されます。</p>
          <p className="mt-3">登録時は NFC ID: {uid} を管理局へ共有してください。</p>
        </div>

        <div className="mt-10 grid gap-3">
          <ProtectedPhoneLink />
          <Link
            href={`/register?uid=${encodeURIComponent(uid)}`}
            className="inline-flex min-h-12 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]"
          >
            登録申請へ進む
          </Link>
          <Link
            href="/dictionary"
            className="inline-flex min-h-12 items-center justify-center border border-[#fffaf0]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#fffaf0]/55"
          >
            図鑑を見る
          </Link>
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

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 min-w-40 items-center justify-center border border-[#fffaf0]/18 px-5 text-xs font-semibold tracking-[0.18em] text-[#fffaf0] transition duration-300 hover:border-[#fffaf0]/55"
          >
            トップへ戻る
          </Link>
          <Link
            href="/dictionary"
            className="inline-flex min-h-11 min-w-40 items-center justify-center border border-[#fffaf0]/18 px-5 text-xs font-semibold tracking-[0.18em] text-[#fffaf0] transition duration-300 hover:border-[#fffaf0]/55"
          >
            登録候補を探す
          </Link>
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_75%_20%,rgba(217,255,216,0.10),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] px-5 py-20 text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <section className="mx-auto max-w-5xl border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.26)] md:p-12">
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
          {item.slug && (
            <Link
              href={`/dictionary/${item.slug}`}
              className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)]"
            >
              図鑑詳細へ
            </Link>
          )}
          <Link
            href="/dictionary"
            className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#fffaf0]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0]"
          >
            図鑑へ戻る
          </Link>
        </div>
      </section>
    </main>
  )
}








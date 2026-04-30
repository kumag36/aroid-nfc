import Link from 'next/link'

type ItemRow = {
  id?: string
  name_en?: string | null
  name_jp?: string | null
  slug?: string | null
}

type IndividualPageProps = {
  params: Promise<{
    uid: string
  }>
}

export const dynamic = 'force-dynamic'

async function fetchItem(uid: string): Promise<{
  item: ItemRow | null
  error: string | null
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return { item: null, error: 'Supabase environment variables are missing.' }
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
      return { item: null, error: `Supabase returned ${response.status}.` }
    }

    const data = (await response.json()) as ItemRow[]
    return { item: data[0] ?? null, error: null }
  } catch (error) {
    return {
      item: null,
      error: error instanceof Error ? error.message : 'Unknown fetch error.',
    }
  }
}

function EmptyState({ uid, error }: { uid: string; error?: string | null }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_75%_20%,rgba(61,93,70,0.42),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] px-5 py-20 text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <section className="w-full max-w-3xl border border-[#fffaf0]/12 bg-[#08140f]/78 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.28)] md:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
          NFC DATA NOT FOUND / {uid}
        </p>
        <h1 className="text-[clamp(2.4rem,7vw,5.4rem)] font-medium leading-tight">
          まだ作ってなかった
          <span className="block">ごめんね😉テヘペロ</span>
        </h1>
        <p className="mt-7 text-[15px] leading-8 text-[#d8d0bf]/78 md:text-lg md:leading-9">
          この個体管理データは、これから登録していきます。図鑑やトップページから、いま見られる記録をのぞいてください。
        </p>
        {error && (
          <p className="mt-5 border border-[#fffaf0]/10 bg-[#fffaf0]/5 px-4 py-3 text-xs leading-6 text-[#d8d0bf]/54">
            Debug: {error}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/dictionary"
            className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#b89558] bg-[#b89558] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d] transition duration-300 hover:-translate-y-0.5"
          >
            図鑑を見る
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#fffaf0]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#fffaf0]/55"
          >
            トップへ戻る
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_75%_20%,rgba(61,93,70,0.36),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] px-5 py-20 text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <section className="mx-auto max-w-5xl border border-[#fffaf0]/12 bg-[#08140f]/78 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.26)] md:p-12">
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
              className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#b89558] bg-[#b89558] px-6 text-sm font-semibold tracking-[0.16em] text-[#15120d]"
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

import Link from 'next/link'
import { plants, type Plant } from '@/lib/dictionary-data'

type DictionaryDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const categoryNotes: Record<Plant['category'], string> = {
  Monstera: '葉の切れ込み、穴あき、節間、斑の入り方を総合して見る。流通名だけで判断せず、株ごとの履歴と表情を残したいグループ。',
  Philodendron: '葉色、葉形、茎の質感、展開時の色変化で印象が大きく変わる。若葉と成熟葉の違いを記録しておきたい。',
  Alocasia: '葉脈、質感、葉裏、休眠傾向を含めて観察する。環境変化への反応が出やすいため、育成メモとの相性が良い。',
  Platycerium: '貯水葉と胞子葉の出方、仕立て、成長点の状態で個体差が見える。時間をかけて完成度が増す植物。',
  'Other Aroids': '比較対象や周辺ジャンルも記録し、斑入り観葉全体の見分け方に役立てるための枠。',
}

function getTone(plant: Plant) {
  if (plant.tags.some((tag) => tag.includes('白斑'))) {
    return {
      variegation: '白斑の抜け方、白勝ち部分の面積、緑との境界を確認。白が強い株ほど美しい一方、育成では緑の残り方も重要。',
      care: '強すぎる直射は避け、明るい散光で葉焼けと徒長の両方を防ぐ。白斑部は傷みやすいため風通しを確保する。',
    }
  }

  if (plant.tags.some((tag) => tag.includes('黄斑') || tag.includes('ミント'))) {
    return {
      variegation: '黄斑やミント斑は展開直後と硬化後で色味が変化しやすい。新葉、古葉、茎の入り方をセットで見る。',
      care: '色味を保つために暗すぎる環境を避ける。斑の発色と葉の厚みを見ながら、光量を少しずつ調整する。',
    }
  }

  if (plant.tags.some((tag) => tag.includes('穴あき葉') || tag.includes('細葉'))) {
    return {
      variegation: '斑よりも葉形の完成度が見どころ。切れ込み、穴の密度、葉幅、葉先の伸び方を記録する。',
      care: '根を強く保ち、支柱や湿度で葉姿を整える。環境が安定すると、葉形の個性がよりはっきり出る。',
    }
  }

  return {
    variegation: '葉色、葉形、質感、茎の表情を複合的に観察する。流通名と実物の特徴を照らし合わせて記録する。',
    care: '乾湿のリズムを崩さず、光量と風通しを安定させる。導入直後は新しい環境に馴染むまで変化を見守る。',
  }
}

function buildProfile(plant: Plant) {
  const tone = getTone(plant)

  return [
    {
      label: '見分け方',
      title: '名前ではなく、葉と履歴で見る。',
      body: `${plant.tradeName} は ${plant.category} の中でも、${plant.tags.join('・')} を手がかりに観察したい品種。流通名だけで断定せず、葉形、斑、茎、成長の癖を合わせて確認します。`,
    },
    {
      label: '斑・葉姿',
      title: '美しさは、安定感まで含めて評価する。',
      body: tone.variegation,
    },
    {
      label: '育成メモ',
      title: '状態を崩さず、次の葉につなげる。',
      body: tone.care,
    },
    {
      label: 'ざまくり視点',
      title: '買う前にも、育て始めた後にも残る記録へ。',
      body: '写真映えだけではなく、根、葉の厚み、展開速度、管理環境まで含めて一株を見たい。NFC個体管理とつなげることで、品種紹介から個体の履歴まで追える図鑑に育てます。',
    },
  ]
}

export async function generateStaticParams() {
  return plants.map((plant) => ({ slug: plant.slug }))
}

export async function generateMetadata({ params }: DictionaryDetailPageProps) {
  const { slug } = await params
  const plant = plants.find((item) => item.slug === slug)

  if (!plant) {
    return {
      title: '品種データ未登録 | ざまくりアロイド図鑑',
    }
  }

  return {
    title: `${plant.tradeName} | ざまくりアロイド図鑑`,
    description: `${plant.displayName} の特徴、見分け方、育成メモを記録するざまくりプランツの品種紹介ページ。`,
  }
}

function MissingPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_75%_20%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] px-5 py-20 text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <section className="w-full max-w-3xl border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.28)] md:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
          DICTIONARY DATA NOT FOUND
        </p>
        <h1 className="text-[clamp(2.4rem,7vw,5.4rem)] font-medium leading-tight">
          まだ作ってなかった
          <span className="block">ごめんね😉テヘペロ</span>
        </h1>
        <p className="mt-7 text-[15px] leading-8 text-[#d8d0bf]/78 md:text-lg md:leading-9">
          この品種の詳細ページは、これから育てながら深くしていきます。
          図鑑一覧から、いま記録されている品種を見てください。
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/dictionary" className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]">
            図鑑へ戻る
          </Link>
          <Link href="/" className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#fffaf0]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#fffaf0]/55">
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  )
}

export default async function DictionaryDetailPage({ params }: DictionaryDetailPageProps) {
  const { slug } = await params
  const plant = plants.find((item) => item.slug === slug)

  if (!plant) {
    return <MissingPage />
  }

  const profile = buildProfile(plant)
  const relatedPlants = plants
    .filter((item) => item.slug !== plant.slug && item.category === plant.category)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-[#06100b] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_18%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-16 pt-8 md:pb-24">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-4 text-[#fffaf0]">
          <Link href="/" className="text-xs font-semibold tracking-[0.22em] text-[#fffaf0]/78">
            ZAMAKURI PLANTS
          </Link>
          <nav className="flex items-center gap-5 text-[11px] tracking-[0.2em] text-[#fffaf0]/70">
            <Link href="/dictionary">DICTIONARY</Link>
            <Link href="/i/ZMK-000001">NFC</Link>
          </nav>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 py-16 md:grid-cols-[minmax(0,1fr)_360px] md:items-end md:py-24">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              {plant.category} / VARIETY PROFILE
            </p>
            <h1 className="max-w-5xl text-[clamp(2.35rem,6vw,5.6rem)] font-medium leading-[1.08] tracking-normal">
              {plant.displayName}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#eee7d7]/86 md:text-xl">
              和名 / 流通名：{plant.tradeName}
            </p>
            <p className="mt-8 max-w-3xl text-[15px] leading-8 text-[#d8d0bf]/78 md:text-lg md:leading-9">
              {plant.description}
            </p>
          </div>

          <aside className="border border-[#fffaf0]/12 bg-[#fffaf0]/6 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur">
            <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">
              QUICK FACTS
            </p>
            <dl className="grid gap-4 text-sm leading-7 text-[#d8d0bf]/78">
              <div>
                <dt className="text-[11px] tracking-[0.18em] text-[#fffaf0]/44">CATEGORY</dt>
                <dd>{plant.category}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.18em] text-[#fffaf0]/44">TRADE NAME</dt>
                <dd>{plant.tradeName}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.18em] text-[#fffaf0]/44">TAGS</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {plant.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#fffaf0]/12 bg-[#08140f]/60 px-3 py-1 text-xs text-[#eee7d7]/78">
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 border-b border-[#fffaf0]/10 px-5 py-16 md:grid-cols-[240px_1fr] md:py-24">
        <p className="text-xs font-bold tracking-[0.28em] text-[#b89558]">
          IDENTIFICATION
        </p>
        <div>
          <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-medium leading-tight">
            品種名の奥にある、見分けるための記録。
          </h2>
          <p className="mt-8 max-w-4xl text-[15px] leading-8 text-[#d8d0bf]/78 md:text-lg md:leading-9">
            {categoryNotes[plant.category]}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-16 md:grid-cols-2 md:py-24">
        {profile.map((section) => (
          <article key={section.label} className="min-h-[260px] border border-[#fffaf0]/10 bg-[#07120d]/86 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#d9ffd8]/34 md:p-8">
            <p className="mb-5 text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">
              {section.label}
            </p>
            <h3 className="text-2xl font-medium leading-tight text-[#fffaf0]">
              {section.title}
            </h3>
            <p className="mt-6 text-[15px] leading-8 text-[#d8d0bf]/76">
              {section.body}
            </p>
          </article>
        ))}
      </section>

      <section className="border-y border-[#fffaf0]/10 bg-[#0b1710] px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_420px] md:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              NFC INDIVIDUAL DATABASE
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.8rem)] font-medium leading-tight">
              品種紹介から、一株ごとの履歴へ。
            </h2>
            <p className="mt-7 max-w-3xl text-[15px] leading-8 text-[#d8d0bf]/78">
              同じ品種名でも、斑の入り方、根の状態、育成環境は一株ずつ違います。NFCタグとつなぐことで、図鑑の知識を個体管理の記録へ広げていきます。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link href="/register" className="inline-flex min-h-12 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]">
              個体登録を申請する
            </Link>
            <Link href="/i/ZMK-000001" className="inline-flex min-h-12 items-center justify-center border border-[#fffaf0]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#fffaf0]/55">
              NFC個体管理を見る
            </Link>
          </div>
        </div>
      </section>

      {relatedPlants.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
                RELATED VARIETIES
              </p>
              <h2 className="text-[clamp(1.8rem,3.5vw,3.2rem)] font-medium leading-tight">
                近いカテゴリの品種
              </h2>
            </div>
            <Link href="/dictionary" className="hidden text-xs font-semibold tracking-[0.2em] text-[#d8d0bf]/68 md:block">
              ALL DICTIONARY
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPlants.map((item) => (
              <Link key={item.slug} href={`/dictionary/${item.slug}`} className="group border border-[#fffaf0]/10 bg-[#07120d]/86 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d9ffd8]/34">
                <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">
                  {item.category}
                </p>
                <h3 className="text-xl font-medium leading-snug text-[#fffaf0]">
                  {item.displayName}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#d8d0bf]/72">
                  {item.tradeName}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-[#f7fbf1] px-5 py-16 text-[#191a15] md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] leading-8 text-[#665f55]">
            図鑑は育てながら深くなる。品種の情報と、個体の履歴を同じ文脈で残していきます。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dictionary" className="inline-flex min-h-11 min-w-40 items-center justify-center border border-[#191a15] bg-[#191a15] px-5 text-xs font-semibold tracking-[0.18em] text-[#fffaf0]">
              図鑑へ戻る
            </Link>
            <Link href="/" className="inline-flex min-h-11 min-w-40 items-center justify-center border border-[#191a15]/18 px-5 text-xs font-semibold tracking-[0.18em] text-[#191a15]">
              トップへ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}





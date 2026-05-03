import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import DictionaryPlantImage from '@/app/dictionary/components/DictionaryPlantImage'
import { plants, type Plant } from '@/lib/dictionary-data'
import { labelNameBySlug } from '@/lib/label-name-data'

type DictionaryDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

const categoryNotes: Record<Plant['category'], string> = {
  Monstera:
    '葉の切れ込み、穴あき、節間、斑の入り方を総合して見ます。流通名だけで判断せず、一株ごとの履歴と表情を残したいグループです。',
  Philodendron:
    '葉色、葉形、質感、展開時の色変化で印象が大きく変わります。古葉と新葉の違いを記録しておくと見分けが深まります。',
  Alocasia:
    '葉脈、質感、裏面、休眠傾向まで含めて観察します。環境変化への反応が出やすいため、育成メモとの相性が良い属です。',
  Platycerium:
    '貯水葉と胞子葉の出方、仕立て、成長点の状態で個体差が見えます。時間をかけて完成度が増す植物です。',
  'Other Aroids':
    '比較対象や周辺ジャンルも記録し、斑入り観葉全体の見分け方に役立てるための枠です。',
}

function buildCareFacts(plant: Plant) {
  return [
    plant.temperature ? `適温：${plant.temperature}` : null,
    plant.minimumTemperature ? `最低温度：${plant.minimumTemperature}` : null,
    plant.humidity ? `湿度：${plant.humidity}` : null,
    plant.recommendedStyle ? `おすすめ管理：${plant.recommendedStyle}` : null,
    plant.origin ? `由来：${plant.origin}` : null,
  ].filter(Boolean)
}

function MissingPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="DICTIONARY DATA NOT FOUND"
        title={
          <>
            まだ作ってなかった
            <span className="block">ごめんね😉テヘペロ</span>
          </>
        }
        lead="この品種の詳細ページは、これから育てながら深くしていきます。図鑑一覧から、いま登録されている品種をご覧ください。"
        actions={
          <>
            <Link href="/dictionary" className="zmk-button zmk-button-primary">
              図鑑へ戻る
            </Link>
            <Link href="/" className="zmk-button text-[#fffef8]">
              トップへ戻る
            </Link>
          </>
        }
      />
    </main>
  )
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

export default async function DictionaryDetailPage({ params }: DictionaryDetailPageProps) {
  const { slug } = await params
  const plant = plants.find((item) => item.slug === slug)

  if (!plant) {
    return <MissingPage />
  }

  const label = labelNameBySlug[plant.slug]
  const facts = buildCareFacts(plant)
  const relatedPlants = plants
    .filter((item) => item.slug !== plant.slug && item.category === plant.category)
    .slice(0, 3)

  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow={`${plant.category} / VARIETY PROFILE`}
        title={plant.displayName}
        lead={`和名 / 流通名：${plant.tradeName}。${plant.description}`}
        actions={
          <>
            <Link href="/dictionary" className="zmk-button zmk-button-primary">
              図鑑へ戻る
            </Link>
            <Link href="/register" className="zmk-button text-[#fffef8]">
              個体登録へ
            </Link>
          </>
        }
      />

      <section className="zmk-section">
        <div className="zmk-container grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_420px] lg:items-start">
          <div>
            <p className="zmk-eyebrow mb-5">IDENTIFICATION</p>
            <h2>名前ではなく、葉と履歴で見分ける。</h2>
            <p className="zmk-muted mt-8 max-w-4xl text-[15px] leading-8">
              {categoryNotes[plant.category]}
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <article className="zmk-card p-6">
                <p className="zmk-eyebrow mb-4 text-[11px]">LOOK</p>
                <h3 className="text-2xl">観察ポイント</h3>
                <p className="zmk-muted mt-5 text-[15px] leading-8">
                  葉形、斑の入り方、葉脈、節間、展開後の変化をあわせて見ます。写真映えだけでなく、育つ途中の揺らぎも品種理解の材料になります。
                </p>
              </article>
              <article className="zmk-card p-6">
                <p className="zmk-eyebrow mb-4 text-[11px]">GROW</p>
                <h3 className="text-2xl">育成メモ</h3>
                <p className="zmk-muted mt-5 text-[15px] leading-8">
                  光量、湿度、用土、支柱、根の状態を記録すると、同じ品種でも一株ごとの違いが見えます。NFC管理と組み合わせるほど価値が増します。
                </p>
              </article>
            </div>
          </div>

          <aside className="space-y-4">
            <DictionaryPlantImage plantSlug={plant.slug} />
            <div className="zmk-card p-5">
              <p className="zmk-eyebrow mb-4 text-[11px]">QUICK FACTS</p>
              <dl className="zmk-muted grid gap-4 text-sm leading-7">
                <div>
                  <dt className="zmk-eyebrow text-[10px]">CATEGORY</dt>
                  <dd>{plant.category}</dd>
                </div>
                <div>
                  <dt className="zmk-eyebrow text-[10px]">TRADE NAME</dt>
                  <dd>{plant.tradeName}</dd>
                </div>
                {label ? (
                  <div>
                    <dt className="zmk-eyebrow text-[10px]">LABEL</dt>
                    <dd>{label.shortName}</dd>
                    <dd className="text-xs">{label.fullKana}</dd>
                    {label.note ? <dd className="text-xs text-[#b89558]">{label.note}</dd> : null}
                  </div>
                ) : null}
                <div>
                  <dt className="zmk-eyebrow text-[10px]">TAGS</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {plant.tags.map((tag) => (
                      <span key={tag} className="zmk-pill">
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
                {facts.map((fact) => (
                  <div key={fact}>
                    <dt className="zmk-eyebrow text-[10px]">MEMO</dt>
                    <dd>{fact}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="zmk-section zmk-section-soft">
        <div className="zmk-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="zmk-eyebrow mb-4">NFC INDIVIDUAL DATABASE</p>
            <h2 className="max-w-3xl">品種紹介から、一株ごとの履歴へ。</h2>
            <p className="zmk-muted mt-6 max-w-2xl text-[15px] leading-8">
              同じ品種名でも、斑の入り方、根の状態、育成環境は一株ずつ違います。NFCタグとつなぐことで、図鑑の知識を個体管理の記録へ広げます。
            </p>
          </div>
          <Link href="/nfc/verify" className="zmk-button zmk-button-primary">
            NFC管理を見る
          </Link>
        </div>
      </section>

      {relatedPlants.length > 0 ? (
        <section className="zmk-section">
          <div className="zmk-container">
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="zmk-eyebrow mb-4">RELATED VARIETIES</p>
                <h2>近いカテゴリの品種</h2>
              </div>
              <Link href="/dictionary" className="zmk-muted hidden text-xs font-semibold tracking-[0.2em] md:block">
                ALL DICTIONARY
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPlants.map((item) => (
                <Link key={item.slug} href={`/dictionary/${item.slug}`} className="zmk-card zmk-card-hover block p-5">
                  <p className="zmk-eyebrow mb-4 text-[11px]">{item.category}</p>
                  <h3 className="text-xl font-bold">{item.displayName}</h3>
                  <p className="zmk-muted mt-3 text-sm leading-7">{item.tradeName}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

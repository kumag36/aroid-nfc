import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import FixedCtaBar from '@/app/components/FixedCtaBar'
import PageHero from '@/app/components/PageHero'
import DictionaryPlantImage from '@/app/dictionary/components/DictionaryPlantImage'
import { dictionaryImageCandidates } from '@/lib/dictionary-image-data'
import { listDictionaryImageAssignments, listDictionaryImageExclusions } from '@/lib/dictionary-image-storage'
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
    plant.temperature ? ['適温', plant.temperature] : null,
    plant.minimumTemperature ? ['最低温度', plant.minimumTemperature] : null,
    plant.humidity ? ['湿度', plant.humidity] : null,
    plant.recommendedStyle ? ['おすすめ管理', plant.recommendedStyle] : null,
    plant.origin ? ['由来', plant.origin] : null,
  ].filter((item): item is [string, string] => Boolean(item))
}

async function getPrimaryImageSrc(plantSlug: string) {
  const [assignments, exclusions] = await Promise.all([
    listDictionaryImageAssignments(),
    listDictionaryImageExclusions(),
  ])
  const excludedIds = new Set(exclusions.map((item) => item.imageId))
  const imageById = new Map(dictionaryImageCandidates.map((candidate) => [candidate.id, candidate]))
  const assignment = assignments
    .filter((item) => item.plantSlug === plantSlug && !excludedIds.has(item.imageId))
    .sort((a, b) => {
      if (a.role !== b.role) return a.role === 'primary' ? -1 : 1
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })[0]

  return assignment ? imageById.get(assignment.imageId)?.src ?? null : null
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

  const [primaryImageSrc] = await Promise.all([getPrimaryImageSrc(plant.slug)])
  const label = labelNameBySlug[plant.slug]
  const facts = buildCareFacts(plant)
  const relatedPlants = plants
    .filter((item) => item.slug !== plant.slug && item.category === plant.category)
    .slice(0, 3)
  const contactHref = `mailto:kumajuko@gmail.com?subject=` + encodeURIComponent(`お問い合わせ: ${plant.tradeName}`)

  return (
    <main className="zmk-page">
      <BrandHeader />
      <FixedCtaBar
        primaryHref={contactHref}
        primaryLabel="お問い合わせ"
        secondaryHref="/about"
        secondaryLabel="ショップ情報"
      />
      <PageHero
        eyebrow={`${plant.category} / VARIETY PROFILE`}
        title={<span className="zmk-scientific block">{plant.displayName}</span>}
        lead={`和名 / 流通名：${plant.tradeName}。${plant.description}`}
        imageSrc={primaryImageSrc ?? undefined}
        actions={
          <>
            <Link href="/dictionary" className="zmk-button zmk-button-primary">
              図鑑へ戻る
            </Link>
            <Link href="/about" className="zmk-button text-[#fffef8]">
              ショップ情報
            </Link>
            <Link href={contactHref} className="zmk-button text-[#fffef8]">
              お問い合わせ
            </Link>
          </>
        }
      />

      <section className="zmk-section">
        <div className="zmk-container">
          <article className="relative overflow-hidden border border-[var(--zmk-border)] bg-[var(--zmk-card)] shadow-[0_32px_110px_rgba(44,106,75,0.14)]">
            {primaryImageSrc ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-[0.46] saturate-[1.04] contrast-[1.04] dark:opacity-[0.36]"
                  style={{ backgroundImage: `url(${primaryImageSrc})` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,254,248,0.985)_0%,rgba(255,254,248,0.94)_48%,rgba(247,251,241,0.70)_74%,rgba(217,255,216,0.34)_100%)] dark:bg-[linear-gradient(90deg,rgba(5,10,7,0.97)_0%,rgba(7,17,12,0.92)_48%,rgba(16,41,30,0.76)_76%,rgba(7,17,12,0.54)_100%)]" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(217,255,216,0.36),transparent_32%)]" />
            )}

            <div className="relative z-10 grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-10">
              <div className="max-w-4xl">
                <p className="zmk-eyebrow mb-5">SPECIMEN NOTE</p>
                <h2 className="max-w-3xl">名前ではなく、葉と履歴で見分ける。</h2>
                <p className="zmk-muted mt-7 text-[15px] leading-8">
                  {categoryNotes[plant.category]}
                </p>

                <div className="mt-8">
                  <DictionaryPlantImage plantSlug={plant.slug} />
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <section className="border border-[#2c6a4b]/16 bg-[#fffef8]/94 p-5 shadow-[0_18px_54px_rgba(44,106,75,0.10)] backdrop-blur-md dark:border-[#d9ffd8]/18 dark:bg-[#07110c]/86">
                    <p className="zmk-eyebrow mb-4 text-[11px]">LOOK</p>
                    <h3 className="text-xl">観察ポイント</h3>
                    <p className="zmk-muted mt-4 text-[14px] leading-7">
                      葉形、斑の入り方、葉脈、節間、展開後の変化をあわせて見ます。写真映えだけでなく、育つ途中の揺らぎも品種理解の材料になります。
                    </p>
                  </section>

                  <section className="border border-[#2c6a4b]/16 bg-[#fffef8]/94 p-5 shadow-[0_18px_54px_rgba(44,106,75,0.10)] backdrop-blur-md dark:border-[#d9ffd8]/18 dark:bg-[#07110c]/86">
                    <p className="zmk-eyebrow mb-4 text-[11px]">GROW</p>
                    <h3 className="text-xl">育成メモ</h3>
                    <p className="zmk-muted mt-4 text-[14px] leading-7">
                      光量、湿度、用土、支柱、根の状態を記録すると、同じ品種でも一株ごとの違いが見えます。NFC管理と組み合わせるほど価値が増します。
                    </p>
                  </section>
                </div>
              </div>

              <aside className="border border-[#2c6a4b]/16 bg-[#fffef8]/94 p-5 shadow-[0_18px_54px_rgba(44,106,75,0.10)] backdrop-blur-md dark:border-[#d9ffd8]/18 dark:bg-[#07110c]/88">
                <p className="zmk-eyebrow mb-5 text-[11px]">QUICK FACTS</p>
                <dl className="grid gap-4 text-sm leading-7">
                  <div>
                    <dt className="zmk-eyebrow text-[10px]">CATEGORY</dt>
                    <dd className="zmk-muted">{plant.category}</dd>
                  </div>
                  <div>
                    <dt className="zmk-eyebrow text-[10px]">TRADE NAME</dt>
                    <dd className="zmk-muted">{plant.tradeName}</dd>
                  </div>
                  {label ? (
                    <div>
                      <dt className="zmk-eyebrow text-[10px]">LABEL</dt>
                      <dd className="zmk-muted">{label.shortName}</dd>
                      <dd className="zmk-muted text-xs">{label.fullKana}</dd>
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
                  {facts.map(([name, value]) => (
                    <div key={name}>
                      <dt className="zmk-eyebrow text-[10px]">{name}</dt>
                      <dd className="zmk-muted">{value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </article>
        </div>
      </section>

      <section className="zmk-section zmk-section-soft">
        <div className="zmk-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="zmk-eyebrow mb-4">CONSULTATION</p>
            <h2 className="max-w-3xl">気になる品種は、まず相談から。</h2>
            <p className="zmk-muted mt-6 max-w-2xl text-[15px] leading-8">
              状態、育て方、似た品種との違いを確認したい場合は、メールでお問い合わせください。販売導線は準備が整うまで公開しません。
            </p>
          </div>
          <Link href={contactHref} className="zmk-button zmk-button-primary">
            お問い合わせ
          </Link>
          <Link href="/about" className="zmk-button">
              ショップ情報
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
                  <h3 className="zmk-scientific text-2xl">{item.displayName}</h3>
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

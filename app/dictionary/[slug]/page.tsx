import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import { plants } from '@/lib/dictionary-data'
import { labelNameBySlug } from '@/lib/label-name-data'

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return plants.map((plant) => ({ slug: plant.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const plant = plants.find((item) => item.slug === slug)
  if (!plant) {
    return {
      title: '品種データ未登録 | ざまくりアロイド図鑑',
      description: 'この品種の詳細ページは準備中です。',
    }
  }
  return {
    title: `${plant.tradeName} | ざまくりアロイド図鑑`,
    description: `${plant.displayName} の特徴、見分け方、育成メモを記録するざまくりプランツの品種紹介ページです。`,
  }
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="grid gap-1 border-b border-[var(--zmk-border)] py-3 last:border-b-0">
      <dt className="zmk-eyebrow text-[11px]">{label}</dt>
      <dd className="text-[15px] font-bold leading-7 text-[var(--zmk-ink)]">{value}</dd>
    </div>
  )
}

export default async function DictionaryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const plant = plants.find((item) => item.slug === slug)

  if (!plant) {
    return (
      <main className="zmk-page">
        <BrandHeader />
        <PageHero
          eyebrow="COMING SOON"
          title={<>まだ作ってなかった<span className="block">ごめんね😉テヘペロ</span></>}
          lead="この品種の詳細ページは、育てながら少しずつ深くしていきます。いま登録されている品種は図鑑一覧から見られます。"
          actions={<Link href="/dictionary" className="zmk-button zmk-button-primary">図鑑へ戻る</Link>}
        />
      </main>
    )
  }

  const label = labelNameBySlug[plant.slug]
  const contactHref = `mailto:kumajuko@gmail.com?subject=${encodeURIComponent(`お問い合わせ: ${plant.tradeName}`)}`

  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow={`${plant.category} / VARIETY PROFILE`}
        title={<span className="zmk-scientific">{plant.displayName}</span>}
        lead={`和名 / 流通名：${plant.tradeName}。${plant.description}`}
        actions={
          <>
            <Link href="/dictionary" className="zmk-button zmk-button-primary">図鑑へ戻る</Link>
            <a href={contactHref} className="zmk-button">お問い合わせ</a>
          </>
        }
      />

      <section className="zmk-section">
        <div className="zmk-container grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="grid gap-6">
            <section className="zmk-card p-5 sm:p-7">
              <p className="zmk-eyebrow mb-4">SPECIMEN NOTE</p>
              <h2>名前だけでなく、葉と履歴で見分ける。</h2>
              <p className="mt-5 text-[15px] font-bold leading-8 text-[var(--zmk-ink-soft)]">
                葉の切れ込み、穴あき、節間、斑の入り方を総合して見ます。流通名だけで判断せず、一株ごとの履歴と表情を残したいグループです。
              </p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="zmk-card p-5 sm:p-7">
                <p className="zmk-eyebrow mb-4">LOOK</p>
                <h3>観察ポイント</h3>
                <p className="mt-4 text-sm font-bold leading-8 text-[var(--zmk-ink-soft)]">
                  葉形、斑の入り方、葉脈、節間、展開後の変化をあわせて見ます。写真映えだけでなく、育つ途中の揺らぎも品種理解の材料になります。
                </p>
              </section>
              <section className="zmk-card p-5 sm:p-7">
                <p className="zmk-eyebrow mb-4">GROW</p>
                <h3>育成メモ</h3>
                <p className="mt-4 text-sm font-bold leading-8 text-[var(--zmk-ink-soft)]">
                  光量、湿度、用土、支柱、根の状態を記録すると、同じ品種でも一株ごとの違いが見えます。育成メモと写真を重ねるほど価値が増します。
                </p>
              </section>
            </div>
          </div>

          <aside className="zmk-card p-5 sm:p-6">
            <p className="zmk-eyebrow mb-5">QUICK FACTS</p>
            <dl>
              <DetailRow label="カテゴリ" value={plant.category} />
              <DetailRow label="流通名" value={plant.tradeName} />
              <DetailRow label="ラベル" value={label?.shortName ? `${label.shortName} / ${label.fullKana}` : plant.tradeName} />
              <DetailRow label="適温" value={plant.temperature} />
              <DetailRow label="最低温度" value={plant.minimumTemperature} />
              <DetailRow label="湿度" value={plant.humidity} />
              <DetailRow label="おすすめ管理" value={plant.recommendedStyle} />
              <DetailRow label="由来" value={plant.origin} />
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {plant.tags.map((tag) => <span key={tag} className="zmk-pill">{tag}</span>)}
            </div>
          </aside>
        </div>
      </section>

      <section className="zmk-section zmk-section-soft">
        <div className="zmk-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="zmk-eyebrow mb-4">CONSULTATION</p>
            <h2>気になる品種は、まず相談から。</h2>
            <p className="zmk-muted mt-4 max-w-2xl text-[15px] font-bold leading-8">
              状態、育て方、似た品種との違いを確認したい場合は、メールでお問い合わせください。販売導線は準備が整うまで公開しません。
            </p>
          </div>
          <div className="grid gap-3 sm:w-auto sm:min-w-[220px]">
            <a href={contactHref} className="zmk-button zmk-button-primary">お問い合わせ</a>
            <Link href="/about" className="zmk-button">ショップ情報</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
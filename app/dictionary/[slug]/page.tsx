import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import ScientificName from '@/app/components/ScientificName'
import { plants } from '@/lib/dictionary-data'
import { dictionaryImageCandidates } from '@/lib/dictionary-image-data'
import { listDictionaryImageAssignments, listDictionaryImageExclusions } from '@/lib/dictionary-image-storage'
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

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  if (!value) return null
  return (
    <div className="zmk-detail-fact-row">
      <dt className="zmk-eyebrow text-[11px]">{label}</dt>
      <dd className="text-[15px] font-bold leading-7 text-[var(--zmk-ink)]">{value}</dd>
    </div>
  )
}

async function getPlantImages(plantSlug: string) {
  const [assignments, exclusions] = await Promise.all([
    listDictionaryImageAssignments(),
    listDictionaryImageExclusions(),
  ])
  const excludedIds = new Set(exclusions.map((item) => item.imageId))
  const imageById = new Map(dictionaryImageCandidates.map((candidate) => [candidate.id, candidate]))

  return assignments
    .filter((assignment) => assignment.plantSlug === plantSlug && !excludedIds.has(assignment.imageId))
    .sort((a, b) => {
      if (a.role !== b.role) return a.role === 'primary' ? -1 : 1
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
    .map((assignment) => imageById.get(assignment.imageId))
    .filter((image): image is NonNullable<typeof image> => Boolean(image))
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
  const plantImages = await getPlantImages(plant.slug)
  const primaryImage = plantImages[0]
  const contactHref = `mailto:kumajuko@gmail.com?subject=${encodeURIComponent(`お問い合わせ: ${plant.tradeName}`)}`

  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="zmk-detail-hero">
        <div className="zmk-container">
          <Link href="/dictionary" className="zmk-detail-back">図鑑へ戻る</Link>
          <div className="zmk-detail-hero-grid">
            <div className="zmk-detail-copy">
              <p className="zmk-eyebrow">{plant.category} / VARIETY PROFILE</p>
              <h1 className="zmk-detail-title zmk-scientific"><ScientificName name={plant.displayName} /></h1>
              <p className="zmk-detail-trade">和名 / 流通名：{plant.tradeName}</p>
              <p className="zmk-detail-lead">{plant.description}</p>
              <div className="zmk-detail-tags">
                {plant.tags.map((tag) => <span key={tag} className="zmk-pill">{tag}</span>)}
              </div>
            </div>
            <div className="zmk-detail-image-frame">
              {primaryImage ? (
                <Image
                  src={primaryImage.src}
                  alt={plant.tradeName}
                  fill
                  priority
                  className="zmk-detail-image"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              ) : (
                <div className="zmk-detail-image-empty">No image</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="zmk-detail-section">
        <div className="zmk-container zmk-detail-layout">
          <section className="zmk-detail-panel">
            <p className="zmk-eyebrow">QUICK FACTS</p>
            <dl className="zmk-detail-facts">
              <DetailRow label="学名" value={<span className="zmk-scientific"><ScientificName name={plant.displayName} /></span>} />
              <DetailRow label="流通名" value={plant.tradeName} />
              <DetailRow label="ラベル" value={label?.shortName ? `${label.shortName} / ${label.fullKana}` : plant.tradeName} />
              <DetailRow label="由来" value={plant.origin} />
            </dl>
          </section>

          <section className="zmk-detail-panel">
            <p className="zmk-eyebrow">GROW</p>
            <dl className="zmk-detail-facts">
              <DetailRow label="適温" value={plant.temperature} />
              <DetailRow label="最低温度" value={plant.minimumTemperature} />
              <DetailRow label="湿度" value={plant.humidity} />
              <DetailRow label="おすすめ管理" value={plant.recommendedStyle} />
            </dl>
          </section>

          <section className="zmk-detail-note">
            <div>
              <p className="zmk-eyebrow">OBSERVE</p>
              <h2>葉と履歴で見る。</h2>
              <p>
                葉形、斑の入り方、葉脈、節間、展開後の変化をあわせて見ます。流通名だけで判断せず、一株ごとの履歴と表情を残したい品種です。
              </p>
            </div>
            <a href={contactHref} className="zmk-button zmk-button-primary">お問い合わせ</a>
          </section>
        </div>
      </section>

      {plantImages.length > 1 ? (
        <section className="zmk-detail-gallery-section">
          <div className="zmk-container">
            <p className="zmk-eyebrow mb-4">GALLERY</p>
            <div className="zmk-detail-gallery-wrap">
              <div className="zmk-detail-gallery">
              {plantImages.slice(0, 8).map((image) => (
                <div key={image.id} className="zmk-detail-gallery-item">
                  <Image src={image.src} alt={plant.tradeName} fill className="zmk-detail-image" sizes="42vw" />
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

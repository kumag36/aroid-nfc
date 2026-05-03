'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BrandHeader from '@/app/components/BrandHeader'
import { categories, plants, type Category } from '@/lib/dictionary-data'
import { labelNameBySlug } from '@/lib/label-name-data'

type DictionaryImageResponse = {
  candidates: {
    id: string
    src: string
    suggestedPlantSlugs?: string[]
  }[]
  assignments: {
    imageId: string
    plantSlug: string
    role: 'primary' | 'gallery'
    createdAt: string
  }[]
  exclusions: {
    imageId: string
  }[]
}

export default function DictionaryPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [query, setQuery] = useState('')
  const [cardImages, setCardImages] = useState<Record<string, string>>({})

  useEffect(() => {
    let active = true

    fetch('/api/dictionary/images', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: DictionaryImageResponse) => {
        if (!active) return

        const excludedIds = new Set(data.exclusions.map((item) => item.imageId))
        const imageById = new Map(data.candidates.map((candidate) => [candidate.id, candidate]))
        const nextImages: Record<string, string> = {}

        for (const plant of plants) {
          const assignments = data.assignments
            .filter((assignment) => assignment.plantSlug === plant.slug && !excludedIds.has(assignment.imageId))
            .sort((a, b) => {
              if (a.role !== b.role) return a.role === 'primary' ? -1 : 1
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            })
          const image = assignments[0] ? imageById.get(assignments[0].imageId) : null
          if (image) {
            nextImages[plant.slug] = image.src
            continue
          }

          const suggestedImage = data.candidates.find(
            (candidate) => candidate.suggestedPlantSlugs?.includes(plant.slug) && !excludedIds.has(candidate.id),
          )
          if (suggestedImage) nextImages[plant.slug] = suggestedImage.src
        }

        setCardImages(nextImages)
      })
      .catch(() => {
        if (active) setCardImages({})
      })

    return () => {
      active = false
    }
  }, [])

  const filteredPlants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return plants.filter((plant) => {
      const label = labelNameBySlug[plant.slug]
      const matchesCategory = activeCategory === 'All' || plant.category === activeCategory
      const searchableText = [
        plant.displayName,
        plant.tradeName,
        plant.category,
        plant.description,
        plant.temperature,
        plant.minimumTemperature,
        plant.humidity,
        plant.recommendedStyle,
        plant.origin,
        plant.sourceNote,
        label?.shortName,
        label?.fullKana,
        label?.note,
        ...plant.tags,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesCategory && searchableText.includes(normalizedQuery)
    })
  }, [activeCategory, query])

  const focusCategory = (category: Category | 'All') => {
    setActiveCategory(category)
    document.getElementById('dictionary-list')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <main className="zmk-page">
      <BrandHeader />

      <section className="zmk-hero">
        <Image src="/history/hero-botanical.png" alt="" fill priority className="zmk-hero-media" sizes="100vw" />
        <div className="zmk-hero-shade" />
        <div className="zmk-hero-fade" />
        <div className="zmk-container zmk-hero-body">
          <div className="zmk-rule" />
          <p className="zmk-eyebrow mb-5">ZAMAKURI AROID DICTIONARY</p>
          <h1 className="zmk-title">
            ざまくり
            <span className="block">アロイド図鑑</span>
          </h1>
          <p className="zmk-lead mt-8">
            モンステラを中心に、アロイドの品種・特徴・見分け方を静かに深く記録するWEB図鑑。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={() => focusCategory('Monstera')} className="zmk-button zmk-button-primary">
              モンステラから見る
            </button>
            <button type="button" onClick={() => focusCategory('All')} className="zmk-button text-[#fffef8]">
              全品種を見る
            </button>
          </div>
        </div>
      </section>

      <section className="zmk-section">
        <div className="zmk-container zmk-split-head">
          <div>
            <p className="zmk-eyebrow mb-5">INDEX PHILOSOPHY</p>
            <h2>ただ並べるだけではなく、見分けるための図鑑へ。</h2>
          </div>
          <p className="zmk-muted text-[15px] leading-8">
            流通名・学名・特徴・斑の入り方・育成メモを整理し、購入前にも育成中にも役立つ図鑑を目指します。
          </p>
        </div>
      </section>

      <section id="dictionary-list" className="zmk-section zmk-section-soft">
        <div className="zmk-container">
          <div className="mb-8 grid gap-5 md:grid-cols-[1fr_360px] md:items-end">
            <div>
              <p className="zmk-eyebrow mb-4">COLLECTION / {filteredPlants.length} VARIETIES</p>
              <h2>品種を探す</h2>
            </div>
            <label className="block">
              <span className="zmk-eyebrow mb-2 block text-[11px]">SEARCH</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="名前・学名・タグで検索"
                className="h-12 w-full border border-[var(--zmk-border)] bg-[var(--zmk-card)] px-4 text-sm text-[var(--zmk-ink)] outline-none transition placeholder:text-[#315244]/38 focus:border-[#b89558]/80"
              />
            </label>
          </div>

          <div className="mb-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={`zmk-button shrink-0 ${activeCategory === 'All' ? 'zmk-button-primary' : ''}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`zmk-button shrink-0 ${activeCategory === category ? 'zmk-button-primary' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlants.map((plant, index) => (
              <article key={plant.slug} className="zmk-card zmk-card-hover group relative flex min-h-[340px] flex-col overflow-hidden p-6">
                {cardImages[plant.slug] && (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-[0.34] grayscale-[8%] saturate-[0.86] transition duration-500 group-hover:opacity-[0.46] dark:opacity-[0.30]"
                      style={{ backgroundImage: `url(${cardImages[plant.slug]})` }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,254,248,0.88)_0%,rgba(247,251,241,0.74)_56%,rgba(217,255,216,0.48)_100%)] dark:bg-[linear-gradient(115deg,rgba(7,17,12,0.9)_0%,rgba(16,41,30,0.78)_58%,rgba(7,17,12,0.64)_100%)]" />
                  </>
                )}

                <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
                  <p className="zmk-eyebrow text-[11px]">{plant.category}</p>
                  <span className="zmk-muted text-xs">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="relative z-10 text-xl font-bold text-[var(--zmk-ink-strong)]">{plant.displayName}</h3>
                <p className="zmk-muted relative z-10 mt-3 text-sm leading-7">和名 / 流通名：{plant.tradeName}</p>
                {labelNameBySlug[plant.slug] && (
                  <p className="zmk-muted relative z-10 mt-2 text-xs leading-6">
                    LABEL：{labelNameBySlug[plant.slug].shortName} / {labelNameBySlug[plant.slug].fullKana}
                  </p>
                )}
                <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                  {plant.tags.map((tag) => (
                    <span key={tag} className="zmk-pill">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="zmk-muted relative z-10 mt-6 flex-1 text-[15px] leading-8">{plant.description}</p>
                <Link href={`/dictionary/${plant.slug}`} className="zmk-button relative z-10 mt-7">
                  詳細を見る
                </Link>
              </article>
            ))}
          </div>

          {filteredPlants.length === 0 && (
            <div className="zmk-card px-5 py-12 text-center">
              該当する品種が見つかりませんでした。
            </div>
          )}
        </div>
      </section>

      <section className="zmk-section">
        <div className="zmk-container">
          <p className="zmk-eyebrow mb-5">GROWING ARCHIVE</p>
          <h2>図鑑は、育てながら深くなる。</h2>
          <p className="zmk-muted mt-8 max-w-2xl text-[15px] leading-8">
            品種名を知るところから、一株ごとの表情を見分けるところへ。ざまくりプランツの図鑑は、育成の記録とともに少しずつ精度を増していきます。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="zmk-button zmk-button-primary">
              トップへ戻る
            </Link>
            <Link href="/nfc/verify" className="zmk-button">
              NFC個体管理へ
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

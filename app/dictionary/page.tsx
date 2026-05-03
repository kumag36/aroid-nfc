'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
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

      <PageHero
        eyebrow="ZAMAKURI AROID DICTIONARY"
        title={
          <>
            ざまくり
            <span className="block">アロイド図鑑</span>
          </>
        }
        lead="モンステラを中心に、アロイドの品種・特徴・見分け方を静かに深く記録するWEB図鑑。"
        actions={
          <>
            <button type="button" onClick={() => focusCategory('Monstera')} className="zmk-button zmk-button-primary">
              モンステラから見る
            </button>
            <button type="button" onClick={() => focusCategory('All')} className="zmk-button text-[#fffef8]">
              全品種を見る
            </button>
          </>
        }
      />

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
              <article key={plant.slug} className="zmk-card zmk-card-hover group relative flex min-h-[430px] flex-col overflow-hidden p-0 shadow-[0_28px_90px_rgba(44,106,75,0.12)]">
                {cardImages[plant.slug] && (
                  <>
                    <div
                      className="absolute inset-0 scale-[1.02] bg-cover bg-center opacity-[0.82] saturate-[1.05] contrast-[1.03] transition duration-500 group-hover:scale-[1.06] group-hover:opacity-[0.92] dark:opacity-[0.64] dark:group-hover:opacity-[0.76]"
                      style={{ backgroundImage: `url(${cardImages[plant.slug]})` }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,254,248,0.08)_0%,rgba(255,254,248,0.16)_36%,rgba(255,254,248,0.72)_100%)] dark:bg-[linear-gradient(180deg,rgba(5,10,7,0.18)_0%,rgba(5,10,7,0.36)_42%,rgba(5,10,7,0.82)_100%)]" />
                  </>
                )}

                <div className="relative z-10 flex min-h-[430px] flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="border border-[#fffef8]/72 bg-[#fffef8]/82 px-3 py-1 text-[11px] font-bold tracking-[0.28em] text-[#b89558] shadow-[0_10px_28px_rgba(0,0,0,0.08)] backdrop-blur dark:border-[#d9ffd8]/18 dark:bg-[#07110c]/72">
                      {plant.category}
                    </p>
                    <span className="border border-[#fffef8]/70 bg-[#fffef8]/78 px-2 py-1 text-xs font-semibold text-[#315244]/76 backdrop-blur dark:border-[#d9ffd8]/18 dark:bg-[#07110c]/70 dark:text-[#d9ffd8]/78">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="mt-20 border border-[#2c6a4b]/18 bg-[#fffef8]/96 p-5 shadow-[0_22px_74px_rgba(16,41,30,0.22)] backdrop-blur-md dark:border-[#d9ffd8]/20 dark:bg-[#07110c]/90">
                    <h3 className="zmk-scientific text-2xl text-[#10291e] dark:text-[#fffef8]">{plant.displayName}</h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-[#315244] dark:text-[#d9ffd8]/88">
                      和名 / 流通名：{plant.tradeName}
                    </p>
                    {labelNameBySlug[plant.slug] && (
                      <p className="mt-2 text-xs leading-6 text-[#315244]/78 dark:text-[#d9ffd8]/70">
                        LABEL：{labelNameBySlug[plant.slug].shortName} / {labelNameBySlug[plant.slug].fullKana}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {plant.tags.map((tag) => (
                        <span key={tag} className="zmk-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-6 text-[15px] font-medium leading-8 text-[#173b2a] dark:text-[#f7fbf1]/86">
                      {plant.description}
                    </p>
                    <Link href={`/dictionary/${plant.slug}`} className="zmk-button zmk-button-primary mt-7 w-full">
                      詳細を見る
                    </Link>
                  </div>
                </div>
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

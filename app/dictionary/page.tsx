'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { categories, plants, type Category } from '@/lib/dictionary-data'
import { labelNameBySlug } from '@/lib/label-name-data'
import BrandHeader from '@/app/components/BrandHeader'

type DictionaryImageResponse = {
  candidates: {
    id: string
    src: string
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
            .filter(
              (assignment) =>
                assignment.plantSlug === plant.slug && !excludedIds.has(assignment.imageId),
            )
            .sort((a, b) => {
              if (a.role !== b.role) return a.role === 'primary' ? -1 : 1
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            })
          const image = assignments[0] ? imageById.get(assignments[0].imageId) : null
          if (image) {
            nextImages[plant.slug] = image.src
          }
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
      const matchesCategory =
        activeCategory === 'All' || plant.category === activeCategory
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
    <main className="min-h-screen overflow-hidden bg-[#f7fbf1] text-[#143326] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative bg-[radial-gradient(circle_at_78%_18%,rgba(217,255,216,0.8),transparent_32%),linear-gradient(135deg,#fffef8_0%,#f7fbf1_48%,#d9ffd8_100%)] px-5 pb-20 pt-32 md:pt-40">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f7fbf1] to-transparent" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-[560px] lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              ZAMAKURI AROID DICTIONARY
            </p>
            <h1 className="max-w-4xl text-[clamp(2.55rem,7vw,6.4rem)] font-medium leading-[1.08] tracking-normal">
              ざまくり
              <span className="block">アロイド図鑑</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#315244]/84 md:text-lg md:leading-9">
              モンステラを中心に、アロイドの品種・特徴・見分け方を静かに深く記録するWEB図鑑。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => focusCategory('Monstera')}
                className="inline-flex min-h-12 min-w-52 items-center justify-center border border-[#2c6a4b]/70 bg-[#143326] px-6 text-sm font-semibold tracking-[0.16em] text-[#fffef8] shadow-[0_18px_48px_rgba(44,106,75,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#2c6a4b]"
              >
                モンステラから見る
              </button>
              <button
                type="button"
                onClick={() => focusCategory('All')}
                className="inline-flex min-h-12 min-w-52 items-center justify-center border border-[#2c6a4b]/35 px-6 text-sm font-semibold tracking-[0.16em] text-[#143326] transition duration-300 hover:-translate-y-0.5 hover:border-[#2c6a4b]/65"
              >
                全品種を見る
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative ml-auto max-w-[520px] border border-[#2c6a4b]/12 bg-white/72 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.28)] backdrop-blur-sm">
              <div className="mb-7 flex items-center justify-between gap-5 border-b border-[#2c6a4b]/10 pb-5">
                <p className="text-[11px] font-semibold tracking-[0.28em] text-[#b89558]">
                  LIVE INDEX
                </p>
                <span className="text-[11px] tracking-[0.2em] text-[#315244]/55">DB READY</span>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#d9ffd8]/18 bg-[#fffef8]/52 p-5">
                    <p className="text-[10px] font-semibold tracking-[0.24em] text-[#315244]/48">
                      VARIETIES
                    </p>
                    <p className="mt-4 text-4xl font-medium text-[#143326]">{plants.length}</p>
                  </div>
                  <div className="border border-[#d9ffd8]/18 bg-[#fffef8]/52 p-5">
                    <p className="text-[10px] font-semibold tracking-[0.24em] text-[#315244]/48">
                      CATEGORIES
                    </p>
                    <p className="mt-4 text-4xl font-medium text-[#143326]">{categories.length}</p>
                  </div>
                </div>
                <div className="border border-[#2c6a4b]/10 bg-[#fffef8]/52 p-5">
                  <p className="mb-4 text-[10px] font-semibold tracking-[0.24em] text-[#315244]/48">
                    FOCUS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Monstera', 'Philodendron', 'Alocasia', 'NFC DB'].map((label) => (
                      <span
                        key={label}
                        className="border border-[#2c6a4b]/12 bg-[#d9ffd8]/35 px-3 py-2 text-[10px] font-semibold tracking-[0.16em] text-[#143326]"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 border border-[#d9ffd8]/18" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 border border-[#b89558]/22" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 border-b border-[#2c6a4b]/10 px-5 py-20 md:grid-cols-[220px_1fr] md:py-28">
        <p className="text-xs font-bold tracking-[0.28em] text-[#b89558]">
          INDEX PHILOSOPHY
        </p>
        <div className="max-w-4xl">
          <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-medium leading-tight">
            ただ並べるだけではなく、見分けるための図鑑へ。
          </h2>
          <p className="mt-8 text-[15px] leading-8 text-[#315244]/78 md:text-lg md:leading-9">
            流通名・学名・特徴・斑の入り方・育成メモを整理し、購入前にも育成中にも役立つ図鑑を目指します。
          </p>
        </div>
      </section>

      <section id="dictionary-list" className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="mb-8 grid gap-5 md:grid-cols-[1fr_360px] md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              COLLECTION / {filteredPlants.length} VARIETIES
            </p>
            <h2 className="text-[clamp(2rem,4.5vw,4.6rem)] font-medium leading-tight">
              品種を探す
            </h2>
          </div>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold tracking-[0.22em] text-[#315244]/64">
              SEARCH
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="名前・学名・タグで検索"
              className="h-12 w-full border border-[#2c6a4b]/14 bg-[#fffaf0]/6 px-4 text-sm text-[#143326] outline-none transition placeholder:text-[#315244]/38 focus:border-[#b89558]/80 focus:bg-[#fffaf0]/9"
            />
          </label>
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={`shrink-0 border px-4 py-2 text-xs font-semibold tracking-[0.14em] transition ${
              activeCategory === 'All'
                ? 'border-[#2c6a4b]/55 bg-[#143326] text-[#fffef8] shadow-[0_12px_34px_rgba(44,106,75,0.14)]'
                : 'border-[#2c6a4b]/12 bg-[#fffaf0]/4 text-[#315244]/70 hover:border-[#d9ffd8]/40'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 border px-4 py-2 text-xs font-semibold tracking-[0.14em] transition ${
                activeCategory === category
                  ? 'border-[#2c6a4b]/55 bg-[#143326] text-[#fffef8] shadow-[0_12px_34px_rgba(44,106,75,0.14)]'
                  : 'border-[#2c6a4b]/12 bg-[#fffaf0]/4 text-[#315244]/70 hover:border-[#d9ffd8]/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlants.map((plant, index) => (
            <article
              key={plant.slug}
              className="group relative flex min-h-[340px] flex-col overflow-hidden border border-[#2c6a4b]/10 bg-white/88 p-6 shadow-[0_24px_80px_rgba(44,106,75,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#b89558]/40 hover:bg-white"
            >
              {cardImages[plant.slug] && (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-[0.16] grayscale-[18%] saturate-[0.72] transition duration-500 group-hover:opacity-[0.22]"
                    style={{ backgroundImage: `url(${cardImages[plant.slug]})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,254,248,0.98)_0%,rgba(247,251,241,0.9)_56%,rgba(217,255,216,0.74)_100%)]" />
                </>
              )}

              <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
                <p className="text-[11px] font-bold tracking-[0.22em] text-[#b89558]">
                  {plant.category}
                </p>
                <span className="text-xs text-[#315244]/38">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="relative z-10 text-xl font-medium leading-snug text-[#143326]">
                {plant.displayName}
              </h3>
              <p className="relative z-10 mt-3 text-sm leading-7 text-[#315244]/72">
                和名 / 流通名：{plant.tradeName}
              </p>
              {labelNameBySlug[plant.slug] && (
                <p className="relative z-10 mt-2 text-xs leading-6 text-[#2c6a4b]/72">
                  LABEL：{labelNameBySlug[plant.slug].shortName} / {labelNameBySlug[plant.slug].fullKana}
                </p>
              )}

              <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                {plant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#2c6a4b]/12 bg-[#fffaf0]/6 px-3 py-1 text-xs text-[#315244]/76"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="relative z-10 mt-6 flex-1 text-[15px] leading-8 text-[#315244]/76">
                {plant.description}
              </p>

              <Link
                href={`/dictionary/${plant.slug}`}
                className="relative z-10 mt-7 inline-flex min-h-11 items-center justify-center border border-[#2c6a4b]/18 bg-[#f7fbf1]/55 px-4 text-xs font-semibold tracking-[0.18em] text-[#143326] backdrop-blur-[2px] transition duration-300 group-hover:border-[#b89558]/45"
              >
                詳細を見る
              </Link>
            </article>
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="border border-[#2c6a4b]/12 bg-[#fffaf0]/5 px-5 py-12 text-center text-[#315244]/72">
            該当する品種が見つかりませんでした。
          </div>
        )}
      </section>

      <section className="border-t border-[#2c6a4b]/10 bg-[#f7fbf1] px-5 py-20 text-[#191a15] md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-bold tracking-[0.28em] text-[#8f5949]">
            GROWING ARCHIVE
          </p>
          <h2 className="max-w-4xl text-[clamp(2rem,4.4vw,4.5rem)] font-medium leading-tight">
            図鑑は育てながら深くなる。
          </h2>
          <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#665f55] md:text-lg md:leading-9">
            品種名を知るところから、株ごとの表情を見分けるところへ。ざまくりプランツの図鑑は、育成の記録とともに少しずつ精度を増していきます。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#143326] bg-[#143326] px-6 text-sm font-semibold tracking-[0.16em] text-[#fffef8] transition duration-300 hover:-translate-y-0.5"
            >
              トップへ戻る
            </Link>
            <Link
              href="/i/ZMK-000001"
              className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#191a15]/18 px-6 text-sm font-semibold tracking-[0.16em] text-[#191a15] transition duration-300 hover:-translate-y-0.5 hover:border-[#191a15]/45"
            >
              NFC個体管理へ
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}









'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { categories, plants, type Category } from '@/lib/dictionary-data'
import BrandHeader from '@/app/components/BrandHeader'

export default function DictionaryPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [query, setQuery] = useState('')

  const filteredPlants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return plants.filter((plant) => {
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
    <main className="min-h-screen overflow-hidden bg-[#06100b] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative min-h-[88vh] bg-[radial-gradient(circle_at_80%_18%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-20 pt-32 md:pt-40">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#06100b] to-transparent" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            ZAMAKURI AROID DICTIONARY
          </p>
          <h1 className="max-w-5xl text-[clamp(2.55rem,7vw,6.4rem)] font-medium leading-[1.08] tracking-normal">
            ざまくり
            <span className="block">アロイド図鑑</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#eee7d7]/84 md:text-lg md:leading-9">
            モンステラを中心に、アロイドの品種・特徴・見分け方を静かに深く記録するWEB図鑑。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => focusCategory('Monstera')}
              className="inline-flex min-h-12 min-w-52 items-center justify-center border border-[#d9ffd8]/70 bg-[#d9ffd8]/12 px-6 text-sm font-semibold tracking-[0.16em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]"
            >
              モンステラから見る
            </button>
            <button
              type="button"
              onClick={() => focusCategory('All')}
              className="inline-flex min-h-12 min-w-52 items-center justify-center border border-[#fffaf0]/35 px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:border-[#fffaf0]/65"
            >
              全品種を見る
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 border-b border-[#fffaf0]/10 px-5 py-20 md:grid-cols-[220px_1fr] md:py-28">
        <p className="text-xs font-bold tracking-[0.28em] text-[#b89558]">
          INDEX PHILOSOPHY
        </p>
        <div className="max-w-4xl">
          <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-medium leading-tight">
            ただ並べるだけではなく、見分けるための図鑑へ。
          </h2>
          <p className="mt-8 text-[15px] leading-8 text-[#d8d0bf]/78 md:text-lg md:leading-9">
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
            <span className="mb-2 block text-[11px] font-semibold tracking-[0.22em] text-[#d8d0bf]/64">
              SEARCH
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="名前・学名・タグで検索"
              className="h-12 w-full border border-[#fffaf0]/14 bg-[#fffaf0]/6 px-4 text-sm text-[#fffaf0] outline-none transition placeholder:text-[#d8d0bf]/38 focus:border-[#b89558]/80 focus:bg-[#fffaf0]/9"
            />
          </label>
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={`shrink-0 border px-4 py-2 text-xs font-semibold tracking-[0.14em] transition ${
              activeCategory === 'All'
                ? 'border-[#d9ffd8]/65 bg-[#d9ffd8]/12 text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08)]'
                : 'border-[#fffaf0]/12 bg-[#fffaf0]/4 text-[#eee7d7]/70 hover:border-[#d9ffd8]/40'
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
                  ? 'border-[#d9ffd8]/65 bg-[#d9ffd8]/12 text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08)]'
                  : 'border-[#fffaf0]/12 bg-[#fffaf0]/4 text-[#eee7d7]/70 hover:border-[#d9ffd8]/40'
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
              className="group flex min-h-[340px] flex-col border border-[#fffaf0]/10 bg-[#07120d]/86 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.20)] transition duration-300 hover:-translate-y-1 hover:border-[#d9ffd8]/34 hover:bg-[#0a1711]/92"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <p className="text-[11px] font-bold tracking-[0.22em] text-[#b89558]">
                  {plant.category}
                </p>
                <span className="text-xs text-[#eee7d7]/38">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="text-xl font-medium leading-snug text-[#fffaf0]">
                {plant.displayName}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#d8d0bf]/72">
                和名 / 流通名：{plant.tradeName}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {plant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#fffaf0]/12 bg-[#fffaf0]/6 px-3 py-1 text-xs text-[#eee7d7]/76"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-6 flex-1 text-[15px] leading-8 text-[#d8d0bf]/76">
                {plant.description}
              </p>

              <Link
                href={`/dictionary/${plant.slug}`}
                className="mt-7 inline-flex min-h-11 items-center justify-center border border-[#fffaf0]/18 px-4 text-xs font-semibold tracking-[0.18em] text-[#fffaf0] transition duration-300 group-hover:border-[#d9ffd8]/55 group-hover:text-[#eaffdf]"
              >
                詳細を見る
              </Link>
            </article>
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="border border-[#fffaf0]/12 bg-[#fffaf0]/5 px-5 py-12 text-center text-[#d8d0bf]/72">
            該当する品種が見つかりませんでした。
          </div>
        )}
      </section>

      <section className="border-t border-[#fffaf0]/10 bg-[#f7fbf1] px-5 py-20 text-[#191a15] md:py-28">
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
              className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#191a15] bg-[#191a15] px-6 text-sm font-semibold tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5"
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









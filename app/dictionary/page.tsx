'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BrandHeader from '@/app/components/BrandHeader'
import { categories, plants, type Category } from '@/lib/dictionary-data'
import { labelNameBySlug } from '@/lib/label-name-data'

type DictionaryImageResponse = {
  candidates: { id: string; src: string; suggestedPlantSlugs?: string[] }[]
  assignments: { imageId: string; plantSlug: string; role: 'primary' | 'gallery'; createdAt: string }[]
  exclusions: { imageId: string }[]
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
          if (image) nextImages[plant.slug] = image.src
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
      const searchableText = [plant.displayName, plant.tradeName, plant.category, plant.description, label?.shortName, label?.fullKana, ...plant.tags]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesCategory && searchableText.includes(normalizedQuery)
    })
  }, [activeCategory, query])

  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="px-5 pb-10 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="zmk-eyebrow mb-4 text-[#b89558]">ZAMAKURI AROID DICTIONARY</p>
          <div className="grid gap-6 md:grid-cols-[1fr_360px] md:items-end">
            <div>
              <h1 className="text-[#10291e]">ざまくりアロイド図鑑</h1>
              <p className="mt-5 max-w-2xl text-[15px] font-bold leading-8 text-[#315244]">
                モンステラを中心に、アロイドの品種・特徴・見分け方を静かに深く記録するWEB図鑑です。
              </p>
            </div>
            <label className="block">
              <span className="zmk-eyebrow mb-2 block text-[11px] text-[#b89558]">SEARCH</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="名前・学名・タグで検索" className="h-12 w-full border border-[#10291e]/12 bg-white px-4 text-sm text-[#10291e] outline-none focus:border-[#10291e]" />
            </label>
          </div>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button type="button" onClick={() => setActiveCategory('All')} className={`zmk-button shrink-0 ${activeCategory === 'All' ? 'zmk-button-primary' : ''}`}>All</button>
            {categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`zmk-button shrink-0 ${activeCategory === category ? 'zmk-button-primary' : ''}`}>{category}</button>)}
          </div>
        </div>
      </section>
      <section className="bg-white px-5 py-10">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlants.map((plant) => (
            <article key={plant.slug} className="overflow-hidden border border-[#10291e]/10 bg-[#fffef8] shadow-[0_10px_28px_rgba(44,106,75,0.08)]">
              <div className="relative aspect-[4/3] bg-[#e8f3df]">
                {cardImages[plant.slug] ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cardImages[plant.slug]})` }} /> : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18))]" />
              </div>
              <div className="p-5">
                <p className="zmk-eyebrow mb-3 text-[11px] text-[#b89558]">{plant.category}</p>
                <h2 className="zmk-scientific text-2xl text-[#10291e]">{plant.displayName}</h2>
                <p className="mt-3 text-sm font-bold leading-7 text-[#315244]">和名 / 流通名：{plant.tradeName}</p>
                <div className="mt-4 flex flex-wrap gap-2">{plant.tags.slice(0, 3).map((tag) => <span key={tag} className="zmk-pill">{tag}</span>)}</div>
                <p className="mt-5 text-[14px] leading-7 text-[#173b2a]">{plant.description}</p>
                <Link href={`/dictionary/${plant.slug}`} className="zmk-button zmk-button-primary mt-5 w-full">詳細を見る</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
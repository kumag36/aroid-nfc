'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import BrandHeader from '@/app/components/BrandHeader'
import ScientificName from '@/app/components/ScientificName'
import { categories, plants, type Category } from '@/lib/dictionary-data'
import { labelNameBySlug } from '@/lib/label-name-data'

type DictionaryImageResponse = {
  candidates: { id: string; src: string; suggestedPlantSlugs?: string[] }[]
  assignments: { imageId: string; plantSlug: string; role: 'primary' | 'gallery'; createdAt: string }[]
  exclusions: { imageId: string }[]
}

type PreviewImage = {
  src: string
  title: string
}

export default function DictionaryPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [openSubcategoryFor, setOpenSubcategoryFor] = useState<Category | 'All' | null>(null)
  const [query, setQuery] = useState('')
  const [cardImages, setCardImages] = useState<Record<string, string>>({})
  const [plantImageGalleries, setPlantImageGalleries] = useState<Record<string, string[]>>({})
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])
  const [previewIndex, setPreviewIndex] = useState(0)
  const [previewZoom, setPreviewZoom] = useState(1)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const cardTrackRef = useRef<HTMLDivElement>(null)
  const previewSwipeRef = useRef({ isDown: false, startX: 0, moved: false })

  useEffect(() => {
    let active = true
    fetch('/api/dictionary/images', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: DictionaryImageResponse) => {
        if (!active) return
        const excludedIds = new Set(data.exclusions.map((item) => item.imageId))
        const imageById = new Map(data.candidates.map((candidate) => [candidate.id, candidate]))
        const nextImages: Record<string, string> = {}
        const nextGalleries: Record<string, string[]> = {}
        for (const plant of plants) {
          const assignments = data.assignments
            .filter((assignment) => assignment.plantSlug === plant.slug && !excludedIds.has(assignment.imageId))
            .sort((a, b) => {
              if (a.role !== b.role) return a.role === 'primary' ? -1 : 1
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            })
          const image = assignments[0] ? imageById.get(assignments[0].imageId) : null
          if (image) nextImages[plant.slug] = image.src
          nextGalleries[plant.slug] = assignments
            .map((assignment) => imageById.get(assignment.imageId)?.src)
            .filter((src): src is string => Boolean(src))
        }
        setCardImages(nextImages)
        setPlantImageGalleries(nextGalleries)
      })
      .catch(() => {
        if (active) {
          setCardImages({})
          setPlantImageGalleries({})
        }
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!previewImages.length) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewImages([])
        setPreviewIndex(0)
        setPreviewZoom(1)
      }
      if (event.key === 'ArrowLeft') {
        setPreviewIndex((current) => (previewImages.length ? (current - 1 + previewImages.length) % previewImages.length : 0))
        setPreviewZoom(1)
      }
      if (event.key === 'ArrowRight') {
        setPreviewIndex((current) => (previewImages.length ? (current + 1) % previewImages.length : 0))
        setPreviewZoom(1)
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [previewImages.length])

  const filteredPlants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return plants.filter((plant) => {
      const label = labelNameBySlug[plant.slug]
      const matchesCategory = activeCategory === 'All' || plant.category === activeCategory
      const matchesTag = !activeTag || plant.tags.includes(activeTag)
      const searchableText = [plant.displayName, plant.tradeName, plant.category, plant.description, label?.shortName, label?.fullKana, ...plant.tags]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesCategory && matchesTag && searchableText.includes(normalizedQuery)
    })
  }, [activeCategory, activeTag, query])

  const subcategoryOptions = useMemo(() => {
    return (category: Category | 'All') => {
      const sourcePlants = category === 'All' ? plants : plants.filter((plant) => plant.category === category)
      return Array.from(new Set(sourcePlants.flatMap((plant) => plant.tags))).sort((a, b) => a.localeCompare(b, 'ja'))
    }
  }, [])

  const selectCategory = (category: Category | 'All') => {
    setActiveCategory(category)
    setActiveTag(null)
    setOpenSubcategoryFor(null)
    setActiveCardIndex(0)
  }

  const openSubcategories = (category: Category | 'All') => {
    setActiveTag(null)
    setOpenSubcategoryFor((current) => (current === category ? null : category))
    setActiveCategory(category)
    setActiveCardIndex(0)
  }

  const selectSubcategory = (category: Category | 'All', tag: string) => {
    setActiveCategory(category)
    setActiveTag(tag)
    setOpenSubcategoryFor(null)
    setActiveCardIndex(0)
  }

  const clearSubcategory = () => {
    setActiveTag(null)
    setOpenSubcategoryFor(null)
    setActiveCardIndex(0)
  }

  const selectCardTag = (tag: string) => {
    setQuery('')
    setActiveCategory('All')
    setActiveTag((current) => (current === tag && activeCategory === 'All' ? null : tag))
    setOpenSubcategoryFor(null)
    setActiveCardIndex(0)
    window.requestAnimationFrame(() => cardTrackRef.current?.scrollTo({ left: 0, behavior: 'smooth' }))
  }

  const handleCategoryClick = (category: Category | 'All') => {
    if (category === 'All') selectCategory(category)
    else openSubcategories(category)
  }

  const updateQuery = (value: string) => {
    setQuery(value)
    setActiveCardIndex(0)
  }

  const safeActiveCardIndex = Math.min(activeCardIndex, Math.max(filteredPlants.length - 1, 0))

  const scrollToCard = (index: number) => {
    const track = cardTrackRef.current
    const target = track?.querySelector<HTMLElement>(`[data-card-index="${index}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const showPreviousCard = () => {
    setActiveCardIndex((current) => {
      const next = filteredPlants.length ? (current - 1 + filteredPlants.length) % filteredPlants.length : 0
      window.requestAnimationFrame(() => scrollToCard(next))
      return next
    })
  }

  const showNextCard = () => {
    setActiveCardIndex((current) => {
      const next = filteredPlants.length ? (current + 1) % filteredPlants.length : 0
      window.requestAnimationFrame(() => scrollToCard(next))
      return next
    })
  }

  const updateActiveCardFromScroll = () => {
    const track = cardTrackRef.current
    if (!track) return
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-card-index]'))
    const nearest = cards.reduce(
      (best, card) => {
        const rect = card.getBoundingClientRect()
        const distance = Math.abs(rect.left + rect.width / 2 - trackCenter)
        const index = Number(card.dataset.cardIndex ?? 0)
        return distance < best.distance ? { distance, index } : best
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    )
    setActiveCardIndex(nearest.index)
  }

  const openPreview = (plant: (typeof plants)[number]) => {
    const gallery = plantImageGalleries[plant.slug]?.length ? plantImageGalleries[plant.slug] : cardImages[plant.slug] ? [cardImages[plant.slug]] : []
    if (!gallery.length) return
    setPreviewImages(gallery.map((src) => ({ src, title: plant.displayName })))
    setPreviewIndex(0)
    setPreviewZoom(1)
  }

  const closePreview = () => {
    setPreviewImages([])
    setPreviewIndex(0)
    setPreviewZoom(1)
  }

  const showPreviousPreviewImage = () => {
    setPreviewIndex((current) => (previewImages.length ? (current - 1 + previewImages.length) % previewImages.length : 0))
    setPreviewZoom(1)
  }

  const showNextPreviewImage = () => {
    setPreviewIndex((current) => (previewImages.length ? (current + 1) % previewImages.length : 0))
    setPreviewZoom(1)
  }

  const startPreviewSwipe = (clientX: number) => {
    previewSwipeRef.current = { isDown: true, startX: clientX, moved: false }
  }

  const movePreviewSwipe = (clientX: number) => {
    if (!previewSwipeRef.current.isDown) return
    if (Math.abs(clientX - previewSwipeRef.current.startX) > 8) previewSwipeRef.current.moved = true
  }

  const endPreviewSwipe = (clientX?: number) => {
    if (typeof clientX === 'number' && previewSwipeRef.current.isDown) {
      const distance = clientX - previewSwipeRef.current.startX
      if (Math.abs(distance) > 44 && previewImages.length > 1) {
        if (distance < 0) showNextPreviewImage()
        else showPreviousPreviewImage()
      }
    }
    previewSwipeRef.current.isDown = false
  }

  const renderPlantCard = (plant: (typeof plants)[number], className = '', isCarouselCard = false) => {
    const imageSrc = cardImages[plant.slug]

    return (
      <Link
        key={plant.slug}
        href={`/dictionary/${plant.slug}`}
        className={`group block overflow-hidden border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)] shadow-[0_10px_28px_rgba(44,106,75,0.08)] ${className}`}
        aria-label={`${plant.displayName} の詳細を見る`}
      >
        <div className="zmk-dictionary-card-heading p-5 pb-4">
          <p className="zmk-eyebrow mb-3 text-[11px]">{plant.category}</p>
          <h2 className="zmk-scientific text-2xl"><ScientificName name={plant.displayName} /></h2>
          <p className="mt-3 text-sm font-bold leading-7 text-[var(--zmk-ink-soft)]">和名 / 流通名：{plant.tradeName}</p>
        </div>
        <div
          className="zmk-card-image-button relative aspect-[16/10] bg-[#e8f3df] sm:aspect-[4/3]"
          role={imageSrc ? 'button' : undefined}
          aria-label={imageSrc ? `${plant.displayName} の画像を拡大` : undefined}
          tabIndex={imageSrc ? 0 : undefined}
          onClick={(event) => {
            if (!imageSrc) return
            event.preventDefault()
            event.stopPropagation()
            openPreview(plant)
          }}
          onKeyDown={(event) => {
            if (!imageSrc || (event.key !== 'Enter' && event.key !== ' ')) return
            event.preventDefault()
            event.stopPropagation()
            openPreview(plant)
          }}
        >
          {imageSrc ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageSrc})` }} /> : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18))]" />
          {imageSrc ? <span className="zmk-image-zoom-hint">画像を拡大</span> : null}
          {isCarouselCard ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <span aria-hidden="true">‹</span>
              <span aria-hidden="true">›</span>
            </div>
          ) : null}
        </div>
        <div className="zmk-dictionary-card-body p-5">
          <div className="mt-0 flex flex-wrap gap-2">
            {plant.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                role="button"
                tabIndex={0}
                aria-pressed={activeCategory === 'All' && activeTag === tag}
                className={`zmk-pill zmk-card-tag ${activeCategory === 'All' && activeTag === tag ? 'zmk-card-tag-active' : ''}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  selectCardTag(tag)
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  event.preventDefault()
                  event.stopPropagation()
                  selectCardTag(tag)
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[14px] leading-7 text-[var(--zmk-ink)]">{plant.description}</p>
          <span className="zmk-button zmk-button-primary mt-5 w-full">詳細を見る</span>
        </div>
      </Link>
    )
  }

  const renderFilterControls = (className = '') => (
    <div className={className}>
      <label className="block">
        <span className="zmk-eyebrow mb-2 block text-[11px]">SEARCH</span>
        <input type="search" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="名前・学名・タグで検索" className="h-12 w-full border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)] px-4 text-sm text-[var(--zmk-ink)] outline-none focus:border-[var(--zmk-border-strong)]" />
      </label>
      <div className="zmk-filter-rail mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="分類ソート">
          <button
            type="button"
            onClick={() => handleCategoryClick('All')}
            className={`zmk-button zmk-filter-button shrink-0 ${activeCategory === 'All' && !activeTag ? 'zmk-button-primary' : ''}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`zmk-button zmk-filter-button shrink-0 ${activeCategory === category && !activeTag ? 'zmk-button-primary' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {openSubcategoryFor ? (
        <div className="zmk-subcategory-panel mt-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-[var(--zmk-ink-soft)]">{openSubcategoryFor} のサブカテゴリ</p>
            <button type="button" onClick={clearSubcategory} className="zmk-subcategory-clear">解除</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => selectCategory(openSubcategoryFor)}
              className={`zmk-subcategory-chip shrink-0 ${!activeTag ? 'zmk-subcategory-chip-active' : ''}`}
            >
              すべて
            </button>
            {subcategoryOptions(openSubcategoryFor).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => selectSubcategory(openSubcategoryFor, tag)}
                className={`zmk-subcategory-chip shrink-0 ${activeTag === tag ? 'zmk-subcategory-chip-active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <p className="mt-3 text-sm font-bold text-[var(--zmk-ink-soft)]">
        {filteredPlants.length} 件 ・ カードをタップで詳細{activeTag ? ` ・ ${activeTag}` : ' ・ カテゴリをタップでサブ分類'}
      </p>
    </div>
  )

  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="zmk-dictionary-hero px-5 pb-6 pt-24 sm:pb-10 sm:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="zmk-eyebrow zmk-dictionary-intro mb-4">ZAMAKURI AROID DICTIONARY</p>
          <div className="grid gap-6 md:grid-cols-[1fr_360px] md:items-end">
            <div className="zmk-dictionary-intro">
              <h1 className="zmk-dictionary-title">アロイド図鑑</h1>
              <p className="zmk-dictionary-lead mt-4 max-w-2xl text-[15px] font-bold leading-8 text-[var(--zmk-ink-soft)]">
                品種、斑、葉姿、育て方の記録。
              </p>
            </div>
            {renderFilterControls('zmk-dictionary-top-controls')}
          </div>
        </div>
      </section>
      <section className="zmk-dictionary-cards-section bg-[var(--zmk-bg-card)] py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:hidden">
          <div className="zmk-card-carousel-header mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-[var(--zmk-ink-soft)]">
              スワイプできます ・ <span aria-hidden="true">‹</span> {filteredPlants.length ? `${safeActiveCardIndex + 1} / ${filteredPlants.length}` : '0 / 0'} <span aria-hidden="true">›</span>
            </p>
            <div className="flex gap-2" aria-label="図鑑カード操作">
              <button type="button" onClick={showPreviousCard} className="zmk-card-nav-button" aria-label="前の図鑑カードへ">
                <span aria-hidden="true">‹</span>
                <span>前へ</span>
              </button>
              <button type="button" onClick={showNextCard} className="zmk-card-nav-button" aria-label="次の図鑑カードへ">
                <span>次へ</span>
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
          <div ref={cardTrackRef} className="zmk-card-carousel" aria-label="図鑑カード" onScroll={updateActiveCardFromScroll}>
            {filteredPlants.length ? (
              filteredPlants.map((plant, index) => (
                <div key={plant.slug} data-card-index={index} className="zmk-card-snap">
                  {renderPlantCard(plant, 'zmk-mobile-card', true)}
                </div>
              ))
            ) : (
              <p className="zmk-muted w-full py-12 text-center text-sm font-bold">該当する品種がありません。</p>
            )}
          </div>
        </div>

        <div className="mx-auto hidden max-w-7xl gap-4 px-5 sm:grid sm:grid-cols-2 lg:grid-cols-3" aria-label="図鑑カード一覧">
          {filteredPlants.map((plant) => (
            renderPlantCard(plant)
          ))}
          {filteredPlants.length === 0 ? <p className="zmk-muted py-12 text-center text-sm font-bold sm:col-span-2 lg:col-span-3">該当する品種がありません。</p> : null}
        </div>
      </section>
      {previewImages.length ? (
        <div className="zmk-image-lightbox" role="dialog" aria-modal="true" aria-label={`${previewImages[previewIndex].title} の拡大画像`} onClick={closePreview}>
          <div className="zmk-image-lightbox-toolbar" onClick={(event) => event.stopPropagation()}>
            <p>{previewImages[previewIndex].title} ・ {previewIndex + 1} / {previewImages.length}</p>
            <div className="flex gap-2">
              {previewImages.length > 1 ? <button type="button" onClick={showPreviousPreviewImage} aria-label="前の写真">‹</button> : null}
              <button type="button" onClick={() => setPreviewZoom((zoom) => Math.max(1, Number((zoom - 0.25).toFixed(2))))} aria-label="縮小">−</button>
              <button type="button" onClick={() => setPreviewZoom(1)} aria-label="等倍">1x</button>
              <button type="button" onClick={() => setPreviewZoom((zoom) => Math.min(2.5, Number((zoom + 0.25).toFixed(2))))} aria-label="拡大">＋</button>
              {previewImages.length > 1 ? <button type="button" onClick={showNextPreviewImage} aria-label="次の写真">›</button> : null}
              <button type="button" onClick={closePreview} aria-label="閉じる">閉じる</button>
            </div>
          </div>
          <div
            className="zmk-image-lightbox-stage"
            onClick={(event) => {
              if (previewSwipeRef.current.moved) {
                event.stopPropagation()
                previewSwipeRef.current.moved = false
              }
            }}
            onPointerDown={(event) => {
              if (event.pointerType === 'mouse' && event.button !== 0) return
              event.currentTarget.setPointerCapture(event.pointerId)
              startPreviewSwipe(event.clientX)
            }}
            onPointerMove={(event) => movePreviewSwipe(event.clientX)}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              endPreviewSwipe(event.clientX)
            }}
            onPointerCancel={() => endPreviewSwipe()}
          >
            {previewImages.length > 1 ? (
              <div className="zmk-image-lightbox-arrows" aria-hidden="true">
                <span>‹</span>
                <span>›</span>
              </div>
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImages[previewIndex].src}
              alt={`${previewImages[previewIndex].title} の拡大画像`}
              style={{ transform: `scale(${previewZoom})` }}
              onClick={closePreview}
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}

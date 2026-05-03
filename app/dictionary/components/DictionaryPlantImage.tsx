'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import type {
  DictionaryImageAssignment,
  DictionaryImageCandidate,
  DictionaryImageExclusion,
} from '@/lib/dictionary-image-data'

type ResponseShape = {
  candidates: DictionaryImageCandidate[]
  assignments: DictionaryImageAssignment[]
  exclusions: DictionaryImageExclusion[]
}

type AssignedImage = {
  assignment: DictionaryImageAssignment
  image: DictionaryImageCandidate
}

export default function DictionaryPlantImage({ plantSlug }: { plantSlug: string }) {
  const [data, setData] = useState<ResponseShape | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let active = true

    fetch(`/api/dictionary/images?plantSlug=${encodeURIComponent(plantSlug)}`, {
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((result) => {
        if (active) {
          setData(result)
        }
      })
      .catch(() => {
        if (active) {
          setData({ candidates: [], assignments: [], exclusions: [] })
        }
      })

    return () => {
      active = false
    }
  }, [plantSlug])

  const assignedImages = useMemo<AssignedImage[]>(() => {
    if (!data) {
      return []
    }

    const excludedIds = new Set(data.exclusions.map((item) => item.imageId))
    const imageById = new Map(data.candidates.map((candidate) => [candidate.id, candidate]))

    return data.assignments
      .filter((assignment) => !excludedIds.has(assignment.imageId))
      .map((assignment) => {
        const image = imageById.get(assignment.imageId)
        return image ? { assignment, image } : null
      })
      .filter((item): item is AssignedImage => Boolean(item))
      .sort((a, b) => {
        if (a.assignment.role !== b.assignment.role) {
          return a.assignment.role === 'primary' ? -1 : 1
        }

        return (
          new Date(a.assignment.createdAt).getTime() -
          new Date(b.assignment.createdAt).getTime()
        )
      })
  }, [data])

  const safeActiveIndex = assignedImages[activeIndex] ? activeIndex : 0
  const activeImage = assignedImages[safeActiveIndex] ?? null

  if (!activeImage) {
    return (
      <div className="relative flex aspect-[16/9] min-h-[250px] items-end overflow-hidden border border-[#2c6a4b]/16 bg-[radial-gradient(circle_at_50%_18%,rgba(217,255,216,0.18),transparent_36%),linear-gradient(160deg,#0b1710,#030604)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div className="absolute inset-5 border border-[#d9ffd8]/10" />
        <div className="relative">
          <p className="zmk-eyebrow mb-3 text-[11px]">IMAGE AWAITING SELECTION</p>
          <p className="text-sm leading-7 text-[#d9ffd8]/72">
            管理画面でこの品種の参考画像を PRIMARY または GALLERY に採用すると、ここにスライド表示されます。
          </p>
        </div>
      </div>
    )
  }

  const goPrevious = () => {
    setActiveIndex((current) => (current - 1 + assignedImages.length) % assignedImages.length)
  }

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % assignedImages.length)
  }

  return (
    <figure className="overflow-hidden border border-[#2c6a4b]/16 bg-[#020503] shadow-[0_24px_80px_rgba(0,0,0,0.20)]">
      <div className="relative aspect-[16/9] bg-[#020503]">
        <Image
          src={activeImage.image.src}
          alt={activeImage.image.originalName}
          fill
          sizes="(min-width: 1024px) 760px, 100vw"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,3,0.02)_0%,rgba(2,5,3,0.08)_58%,rgba(2,5,3,0.52)_100%)]" />

        {assignedImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center border border-white/28 bg-[#020503]/48 text-lg text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur transition hover:bg-[#020503]/72"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center border border-white/28 bg-[#020503]/48 text-lg text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur transition hover:bg-[#020503]/72"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        ) : null}

        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
          <figcaption className="max-w-[70%] border border-white/18 bg-[#020503]/58 px-3 py-2 text-[11px] leading-5 text-white/82 backdrop-blur">
            <span className="zmk-eyebrow block text-[9px]">REFERENCE IMAGE</span>
            <span className="line-clamp-1">{activeImage.image.originalName}</span>
          </figcaption>
          <span className="zmk-ui border border-white/20 bg-[#020503]/58 px-3 py-2 text-[10px] text-white/78 backdrop-blur">
            {String(safeActiveIndex + 1).padStart(2, '0')} / {String(assignedImages.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {assignedImages.length > 1 ? (
        <div className="flex gap-1 overflow-x-auto border-t border-[#2c6a4b]/12 bg-white/92 p-1 [scrollbar-width:none] dark:bg-[#07110c]/92 [&::-webkit-scrollbar]:hidden">
          {assignedImages.slice(0, 10).map(({ assignment, image }, index) => (
            <button
              key={assignment.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden border transition ${
                index === safeActiveIndex
                  ? 'border-[#b89558] opacity-100'
                  : 'border-transparent opacity-58 hover:opacity-90'
              }`}
              aria-label={`Show reference image ${index + 1}`}
            >
              <Image
                src={image.src}
                alt={image.originalName}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </figure>
  )
}

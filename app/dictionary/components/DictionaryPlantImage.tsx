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

  const primary = assignedImages[0] ?? null
  const gallery = assignedImages.slice(1)

  if (!primary) {
    return (
      <div className="relative flex aspect-[4/5] min-h-[360px] items-end overflow-hidden border border-[#2c6a4b]/12 bg-[radial-gradient(circle_at_50%_18%,rgba(217,255,216,0.11),transparent_36%),linear-gradient(160deg,#0b1710,#030604)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="absolute inset-6 border border-[#2c6a4b]/8" />
        <div className="relative">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">
            IMAGE AWAITING SELECTION
          </p>
          <p className="text-sm leading-7 text-[#315244]/72">
            この品種の画像は、管理者が確認してから表示されます。
          </p>
        </div>
      </div>
    )
  }

  return (
    <figure className="overflow-hidden border border-[#2c6a4b]/12 bg-[#020503] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="aspect-[4/5]">
        <Image
          src={primary.image.src}
          alt={primary.image.originalName}
          width={primary.image.width}
          height={primary.image.height}
          sizes="(min-width: 768px) 360px, 100vw"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <figcaption className="border-t border-[#2c6a4b]/10 bg-white/92 px-4 py-3 text-[11px] leading-6 text-[#315244]/62">
        管理者確認済み画像 / {primary.image.source}
      </figcaption>

      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-1 border-t border-[#2c6a4b]/10 bg-white p-1">
          {gallery.slice(0, 6).map(({ assignment, image }) => (
            <div key={assignment.id} className="relative aspect-square overflow-hidden bg-[#020503]">
              <Image
                src={image.src}
                alt={image.originalName}
                fill
                sizes="120px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </figure>
  )
}

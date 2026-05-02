'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import type {
  DictionaryImageAssignment,
  DictionaryImageCandidate,
} from '@/lib/dictionary-image-data'

type ResponseShape = {
  candidates: DictionaryImageCandidate[]
  assignments: DictionaryImageAssignment[]
}

export default function DictionaryPlantImage({ plantSlug }: { plantSlug: string }) {
  const [data, setData] = useState<ResponseShape | null>(null)

  useEffect(() => {
    let active = true

    fetch(`/api/dictionary/images?plantSlug=${encodeURIComponent(plantSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (active) {
          setData(result)
        }
      })
      .catch(() => {
        if (active) {
          setData({ candidates: [], assignments: [] })
        }
      })

    return () => {
      active = false
    }
  }, [plantSlug])

  const image = useMemo(() => {
    if (!data) {
      return null
    }

    const primary =
      data.assignments.find((assignment) => assignment.role === 'primary') ??
      data.assignments[0]

    if (!primary) {
      return null
    }

    return data.candidates.find((candidate) => candidate.id === primary.imageId) ?? null
  }, [data])

  if (!image) {
    return (
      <div className="relative flex aspect-[4/5] min-h-[360px] items-end overflow-hidden border border-[#fffaf0]/12 bg-[radial-gradient(circle_at_50%_18%,rgba(217,255,216,0.11),transparent_36%),linear-gradient(160deg,#0b1710,#030604)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="absolute inset-6 border border-[#fffaf0]/8" />
        <div className="relative">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">
            IMAGE AWAITING SELECTION
          </p>
          <p className="text-sm leading-7 text-[#d8d0bf]/72">
            この品種の画像は、管理者が確認してから表示されます。
          </p>
        </div>
      </div>
    )
  }

  return (
    <figure className="overflow-hidden border border-[#fffaf0]/12 bg-[#020503] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="aspect-[4/5]">
        <Image
          src={image.src}
          alt={image.originalName}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 360px, 100vw"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <figcaption className="border-t border-[#fffaf0]/10 bg-[#07120d]/92 px-4 py-3 text-[11px] leading-6 text-[#d8d0bf]/62">
        管理者確認済み画像 / {image.source}
      </figcaption>
    </figure>
  )
}

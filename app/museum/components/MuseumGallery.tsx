'use client'

import { useEffect, useMemo, useState } from 'react'

type MuseumWork = {
  id: string
  title: string
  description: string
  createdAt: string
  pages: {
    path: string
    url: string
  }[]
}

type MuseumResponse = {
  works: MuseumWork[]
}

export default function MuseumGallery() {
  const [works, setWorks] = useState<MuseumWork[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    fetch('/api/museum', { cache: 'no-store' })
      .then((response) => response.json() as Promise<MuseumResponse>)
      .then((data) => {
        if (!ignore) {
          setWorks(data.works ?? [])
          setSelectedId(data.works?.[0]?.id ?? null)
        }
      })
      .catch(() => {
        if (!ignore) {
          setWorks([])
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  const selectedWork = useMemo(
    () => works.find((work) => work.id === selectedId) ?? works[0],
    [selectedId, works],
  )

  if (isLoading) {
    return (
      <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 px-5 py-16 text-center text-[#d8d0bf]/70">
        展示室を整えています。
      </div>
    )
  }

  if (works.length === 0) {
    return (
      <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">NO EXHIBITS YET</p>
        <h2 className="text-[clamp(2rem,5vw,4.2rem)] font-medium leading-tight text-[#fffaf0]">
          まだ展示作品はありません。
        </h2>
        <p className="mt-7 max-w-2xl text-[15px] leading-8 text-[#d8d0bf]/76 md:text-lg md:leading-9">
          管理者ページから漫画をアップすると、ここに美術館の展示として並びます。
          スマホでは縦読み、PCでは展示室のように閲覧できます。
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">
            COLLECTION / {works.length}
          </p>
          <div className="grid gap-2">
            {works.map((work) => (
              <button
                key={work.id}
                type="button"
                onClick={() => setSelectedId(work.id)}
                className={`border px-4 py-4 text-left transition duration-300 ${
                  selectedWork?.id === work.id
                    ? 'border-[#d9ffd8]/55 bg-[#d9ffd8]/10 text-[#fffaf0]'
                    : 'border-[#fffaf0]/10 bg-[#fffaf0]/4 text-[#d8d0bf]/72 hover:border-[#d9ffd8]/30'
                }`}
              >
                <span className="block text-sm font-semibold leading-6">{work.title}</span>
                <span className="mt-2 block text-[11px] tracking-[0.14em] text-[#d8d0bf]/48">
                  {work.pages.length} PAGES
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {selectedWork && (
        <article className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-7">
          <div className="mb-7 border-b border-[#fffaf0]/10 pb-6">
            <p className="mb-4 text-[11px] font-semibold tracking-[0.28em] text-[#b89558]">
              SMARTOON EXHIBITION
            </p>
            <h2 className="text-[clamp(1.9rem,4vw,3.8rem)] font-medium leading-tight text-[#fffaf0]">
              {selectedWork.title}
            </h2>
            {selectedWork.description && (
              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#d8d0bf]/76">
                {selectedWork.description}
              </p>
            )}
          </div>

          <div className="mx-auto grid max-w-[760px] gap-3">
            {selectedWork.pages.map((page, index) => (
              <figure key={page.path} className="overflow-hidden border border-[#fffaf0]/8 bg-[#050806]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.url}
                  alt={`${selectedWork.title} ${index + 1}ページ`}
                  className="h-auto w-full object-contain"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </figure>
            ))}
          </div>
        </article>
      )}
    </div>
  )
}

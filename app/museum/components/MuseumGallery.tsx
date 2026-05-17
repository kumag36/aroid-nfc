'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

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

type MuseumGalleryProps = {
  initialWorks?: MuseumWork[]
}

type ReadingMode = 'horizontal' | 'vertical'

export default function MuseumGallery({ initialWorks = [] }: MuseumGalleryProps) {
  const [works, setWorks] = useState<MuseumWork[]>(initialWorks)
  const [selectedId, setSelectedId] = useState<string | null>(initialWorks[0]?.id ?? null)
  const [pageIndex, setPageIndex] = useState(0)
  const [readingMode, setReadingMode] = useState<ReadingMode>('horizontal')
  const [isLoading, setIsLoading] = useState(initialWorks.length === 0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null)
  const [fullscreenScrollTarget, setFullscreenScrollTarget] = useState<number | null>(null)
  const [isFullscreenZoomed, setIsFullscreenZoomed] = useState(false)
  const readerRef = useRef<HTMLDivElement | null>(null)
  const fullscreenReaderRef = useRef<HTMLDivElement | null>(null)
  const workListRef = useRef<HTMLDivElement | null>(null)
  const readerTopRef = useRef<HTMLDivElement | null>(null)
  const isFullscreenOpen = fullscreenIndex !== null

  useEffect(() => {
    let ignore = false

    fetch('/api/museum', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`museum api ${response.status}`)
        }
        return response.json() as Promise<MuseumResponse>
      })
      .then((data) => {
        if (!ignore) {
          const nextWorks = data.works ?? []
          setWorks(nextWorks)
          setSelectedId((currentId) => {
            if (currentId && nextWorks.some((work) => work.id === currentId)) {
              return currentId
            }
            return nextWorks[0]?.id ?? null
          })
          setErrorMessage(null)
        }
      })
      .catch((error) => {
        if (!ignore) {
          setWorks([])
          setSelectedId(null)
          setErrorMessage(error instanceof Error ? error.message : 'museum api error')
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
  }, [reloadKey])

  const selectedWork = useMemo(
    () => works.find((work) => work.id === selectedId) ?? works[0],
    [selectedId, works],
  )
  const selectedWorkIndex = selectedWork ? works.findIndex((work) => work.id === selectedWork.id) : -1
  const nextWork = selectedWorkIndex >= 0 ? works[selectedWorkIndex + 1] : null

  useEffect(() => {
    readerRef.current?.scrollTo({ left: 0, behavior: 'instant' })
  }, [selectedId])

  useEffect(() => {
    if (!isFullscreenOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isFullscreenOpen])

  useEffect(() => {
    if (fullscreenIndex === null || fullscreenScrollTarget === null) return

    window.requestAnimationFrame(() => {
      const item = fullscreenReaderRef.current?.children.item(fullscreenScrollTarget) as HTMLElement | null
      item?.scrollIntoView({
        behavior: 'instant',
        block: readingMode === 'vertical' ? 'start' : 'nearest',
        inline: readingMode === 'horizontal' ? 'center' : 'nearest',
      })
      setFullscreenScrollTarget(null)
    })
  }, [fullscreenIndex, fullscreenScrollTarget, readingMode])

  function selectWork(id: string) {
    setPageIndex(0)
    setFullscreenIndex(null)
    setFullscreenScrollTarget(null)
    setIsFullscreenZoomed(false)
    setSelectedId(id)
  }

  function changeReadingMode(mode: ReadingMode) {
    setReadingMode(mode)
    setPageIndex(0)
    setIsFullscreenZoomed(false)
    readerRef.current?.scrollTo({ left: 0, behavior: 'instant' })
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToPage(index: number) {
    if (!selectedWork) return

    const nextIndex = Math.min(Math.max(index, 0), selectedWork.pages.length - 1)
    const item = readerRef.current?.children.item(nextIndex) as HTMLElement | null

    item?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setPageIndex(nextIndex)
  }

  function openFullscreen(index: number) {
    setPageIndex(index)
    setFullscreenIndex(index)
    setFullscreenScrollTarget(index)
    setIsFullscreenZoomed(false)
  }

  function closeFullscreen() {
    if (fullscreenIndex !== null) {
      setPageIndex(fullscreenIndex)
    }
    setFullscreenScrollTarget(null)
    setIsFullscreenZoomed(false)
    setFullscreenIndex(null)
  }

  function toggleFullscreenZoom() {
    setIsFullscreenZoomed((current) => !current)
  }

  function updatePageIndexFromScroll() {
    const reader = readerRef.current
    if (!reader) return

    const readerCenter = reader.scrollLeft + reader.clientWidth / 2
    const children = Array.from(reader.children) as HTMLElement[]
    const nextIndex = children.reduce((closestIndex, child, index) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2
      const closestChild = children[closestIndex]
      const closestCenter = closestChild.offsetLeft + closestChild.clientWidth / 2

      return Math.abs(childCenter - readerCenter) < Math.abs(closestCenter - readerCenter) ? index : closestIndex
    }, 0)

    setPageIndex(nextIndex)
  }

  function updateFullscreenIndexFromScroll(axis: 'horizontal' | 'vertical') {
    const reader = fullscreenReaderRef.current
    if (!reader) return

    const readerCenter =
      axis === 'horizontal'
        ? reader.scrollLeft + reader.clientWidth / 2
        : reader.scrollTop + reader.clientHeight / 2
    const children = Array.from(reader.children) as HTMLElement[]
    const nextIndex = children.reduce((closestIndex, child, index) => {
      const childCenter =
        axis === 'horizontal'
          ? child.offsetLeft + child.clientWidth / 2
          : child.offsetTop + child.clientHeight / 2
      const closestChild = children[closestIndex]
      const closestCenter =
        axis === 'horizontal'
          ? closestChild.offsetLeft + closestChild.clientWidth / 2
          : closestChild.offsetTop + closestChild.clientHeight / 2

      return Math.abs(childCenter - readerCenter) < Math.abs(closestCenter - readerCenter) ? index : closestIndex
    }, 0)

    setFullscreenIndex(nextIndex)
  }

  function scrollToReaderTop() {
    if (readingMode === 'horizontal') {
      scrollToPage(0)
      return
    }
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToWorkList() {
    workListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function selectNextWork() {
    if (!nextWork) return
    selectWork(nextWork.id)
    readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (isLoading) {
    return (
      <div className="border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/86 px-5 py-16 text-center text-[var(--zmk-ink-soft)]">
        展示室を整えています。
      </div>
    )
  }

  if (works.length === 0) {
    return (
      <div className="border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/86 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-12">
        <p className="zmk-eyebrow mb-5 text-xs font-semibold">{errorMessage ? 'MANGA CHECK / ERROR' : 'NO MANGA YET'}</p>
        <h2 className="text-[clamp(2rem,5vw,4.2rem)] font-medium leading-tight">
          {errorMessage ? '漫画データを確認できません。' : 'まだ漫画作品はありません。'}
        </h2>
        <p className="mt-7 max-w-2xl text-[15px] leading-8 text-[var(--zmk-ink-soft)] md:text-lg md:leading-9">
          {errorMessage
            ? `API応答: ${errorMessage}。通信が戻ったら再確認してください。`
            : '管理者ページから漫画をアップすると、ここに作品として並びます。作品もページも左右スライドで読めます。'}
        </p>
        <button
          type="button"
          onClick={() => {
            setIsLoading(true)
            setReloadKey((key) => key + 1)
          }}
          className="zmk-button mt-7"
        >
          再確認
        </button>
      </div>
    )
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
      <aside className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-28 lg:self-start">
        <div className="border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/86 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="zmk-eyebrow text-[11px] font-semibold">
              MANGA LIST / {works.length}
            </p>
            <p className="text-[11px] font-black tracking-[0.16em] text-[var(--zmk-ink-soft)]">SLIDE</p>
          </div>
          <div ref={workListRef} className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:snap-none lg:overflow-visible lg:px-0 lg:pb-0">
            {works.map((work) => (
              <button
                key={work.id}
                type="button"
                onClick={() => selectWork(work.id)}
                className={`min-w-[76vw] max-w-[22rem] snap-start border px-4 py-4 text-left transition duration-300 lg:min-w-0 lg:max-w-none ${
                  selectedWork?.id === work.id
                    ? 'border-[var(--zmk-border-strong)] bg-[var(--zmk-bg-soft)] text-[var(--zmk-ink)]'
                    : 'border-[var(--zmk-border)] bg-[var(--zmk-bg-card)] text-[var(--zmk-ink-soft)] hover:border-[var(--zmk-border-strong)]'
                }`}
              >
                <span className="block text-sm font-semibold leading-6">{work.title}</span>
                <span className="mt-2 block text-[11px] text-[var(--zmk-ink-soft)]">
                  {work.pages.length} PAGES
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {selectedWork && (
        <article className="order-1 min-w-0 overflow-hidden border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/86 p-3 shadow-[0_28px_90px_rgba(44,106,75,0.12)] min-[430px]:p-4 md:p-6 lg:order-2">
          <div ref={readerTopRef} className="mb-3 min-w-0 scroll-mt-24 border-b border-[var(--zmk-border)] pb-3 md:mb-5 md:pb-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="zmk-eyebrow text-[11px] font-semibold">
                MANGA READER
              </p>
              <p className="text-[11px] font-black tracking-[0.18em] text-[var(--zmk-ink-soft)]">
                {readingMode === 'horizontal' ? `${pageIndex + 1}/${selectedWork.pages.length}` : `${selectedWork.pages.length} PAGES`}
              </p>
            </div>
            <div className="mb-3 grid min-w-0 grid-cols-2 gap-1 rounded-full border border-[var(--zmk-border)] bg-[var(--zmk-bg-soft)]/70 p-0.5 md:mb-4 md:max-w-xs">
              <button
                type="button"
                onClick={() => changeReadingMode('vertical')}
                className={`min-h-8 rounded-full text-xs font-bold transition md:min-h-9 ${readingMode === 'vertical' ? 'bg-[var(--zmk-ink)]/88 text-[var(--zmk-bg)]' : 'text-[var(--zmk-ink-soft)]'}`}
              >
                縦読み
              </button>
              <button
                type="button"
                onClick={() => changeReadingMode('horizontal')}
                className={`min-h-8 rounded-full text-xs font-bold transition md:min-h-9 ${readingMode === 'horizontal' ? 'bg-[var(--zmk-ink)]/88 text-[var(--zmk-bg)]' : 'text-[var(--zmk-ink-soft)]'}`}
              >
                横読み
              </button>
            </div>
            <h2 className="hidden break-words text-[1.35rem] font-black leading-tight md:block md:text-[clamp(1.8rem,4vw,3.2rem)]">
              {selectedWork.title}
            </h2>
            {selectedWork.description && (
              <p className="mt-2 hidden max-w-3xl text-[12px] font-bold leading-6 text-[var(--zmk-ink-soft)] md:mt-4 md:block md:text-[15px] md:leading-8">
                {selectedWork.description}
              </p>
            )}
          </div>

          {readingMode === 'horizontal' ? (
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--zmk-bg-card)] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--zmk-bg-card)] to-transparent" />
            <button
              type="button"
              onClick={() => scrollToPage(pageIndex + 1)}
              disabled={pageIndex >= selectedWork.pages.length - 1}
              aria-label="次のページ"
              className="absolute left-2 top-[calc(50%-1.25rem)] z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/94 text-2xl font-black text-[var(--zmk-ink)] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur disabled:opacity-25"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              onClick={() => scrollToPage(pageIndex - 1)}
              disabled={pageIndex === 0}
              aria-label="前のページ"
              className="absolute right-2 top-[calc(50%-1.25rem)] z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/94 text-2xl font-black text-[var(--zmk-ink)] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur disabled:opacity-25"
            >
              <Chevron direction="right" />
            </button>

            <div
              ref={readerRef}
              onScroll={updatePageIndexFromScroll}
              className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-4 min-[430px]:-mx-4 min-[430px]:gap-4 min-[430px]:px-4 md:mx-0 md:px-0"
            >
              {selectedWork.pages.map((page, index) => (
                <figure key={page.path} className="flex h-[min(64dvh,680px)] w-full shrink-0 snap-center items-center justify-center overflow-hidden border border-[#2c6a4b]/8 bg-[#fffef8] dark:border-[#d9ffd8]/12 dark:bg-[#07110c] md:h-[min(74dvh,860px)] md:w-[min(76vw,780px)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.url}
                    alt={`${selectedWork.title} ${index + 1}ページ`}
                    className="h-full w-full cursor-zoom-in object-contain"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onClick={() => openFullscreen(index)}
                  />
                </figure>
              ))}
            </div>

            <div className="mt-1 flex justify-center gap-2">
              {selectedWork.pages.map((page, index) => (
                <button
                  key={`${page.path}-dot`}
                  type="button"
                  onClick={() => scrollToPage(index)}
                  aria-label={`${index + 1}ページへ`}
                  className={`h-2.5 rounded-full transition-all ${index === pageIndex ? 'w-8 bg-[var(--zmk-ink)]' : 'w-2.5 bg-[var(--zmk-border-strong)]/45'}`}
                />
              ))}
            </div>
          </div>
          ) : (
            <div className="mx-auto grid max-w-[760px] gap-1 pb-20 md:gap-3 md:pb-4">
              {selectedWork.pages.map((page, index) => (
                <figure key={page.path} className="overflow-hidden border border-[#2c6a4b]/8 bg-[#fffef8] dark:border-[#d9ffd8]/12 dark:bg-[#07110c]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.url}
                    alt={`${selectedWork.title} ${index + 1}ページ`}
                    className="block h-auto w-full cursor-zoom-in"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onClick={() => openFullscreen(index)}
                  />
                </figure>
              ))}
              <div className="grid gap-2 border border-[var(--zmk-border)] bg-[var(--zmk-bg-soft)] p-3 sm:grid-cols-3">
                <button type="button" onClick={scrollToReaderTop} className="zmk-button">
                  先頭へ
                </button>
                <button type="button" onClick={scrollToWorkList} className="zmk-button">
                  作品一覧へ
                </button>
                <button type="button" onClick={selectNextWork} disabled={!nextWork} className="zmk-button zmk-button-primary disabled:opacity-35">
                  次の話へ
                </button>
              </div>
            </div>
          )}
          {readingMode === 'vertical' ? (
            <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-2 rounded-full border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/94 p-1 shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur md:hidden">
              <button type="button" onClick={scrollToReaderTop} className="min-h-10 rounded-full text-xs font-black text-[var(--zmk-ink)]">
                先頭
              </button>
              <button type="button" onClick={scrollToWorkList} className="min-h-10 rounded-full text-xs font-black text-[var(--zmk-ink)]">
                一覧
              </button>
              <button type="button" onClick={() => changeReadingMode('horizontal')} className="min-h-10 rounded-full bg-[var(--zmk-ink)] text-xs font-black text-[var(--zmk-bg)]">
                横読み
              </button>
            </div>
          ) : null}
          {fullscreenIndex !== null ? (
            <div className="fixed inset-0 z-[80] bg-black">
              <div className="pointer-events-none fixed left-3 top-3 z-[90] rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white/82">
                {fullscreenIndex + 1}/{selectedWork.pages.length}
              </div>
              <div className="fixed right-3 top-3 z-[90] flex gap-2">
                <button
                  type="button"
                  onClick={toggleFullscreenZoom}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-black shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
                >
                  {isFullscreenZoomed ? '縮小' : '拡大'}
                </button>
                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-black shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
                >
                  閉じる
                </button>
              </div>
              {isFullscreenZoomed ? (
                <div className="h-dvh overflow-auto overscroll-contain bg-black p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedWork.pages[fullscreenIndex].url}
                    alt={`${selectedWork.title} ${fullscreenIndex + 1}ページ`}
                    className="mx-auto block h-auto min-h-dvh w-[180vw] max-w-none cursor-zoom-out object-contain sm:w-[150vw] lg:w-[120vw]"
                    onClick={toggleFullscreenZoom}
                  />
                </div>
              ) : readingMode === 'horizontal' ? (
                <div
                  ref={fullscreenReaderRef}
                  onScroll={() => updateFullscreenIndexFromScroll('horizontal')}
                  className="flex h-dvh snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
                >
                  {selectedWork.pages.map((page, index) => (
                    <figure key={`${page.path}-fullscreen`} className="flex h-dvh w-screen shrink-0 snap-center items-center justify-center bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={page.url}
                        alt={`${selectedWork.title} ${index + 1}ページ`}
                        className="max-h-dvh w-screen cursor-zoom-in object-contain"
                        loading={Math.abs(index - fullscreenIndex) <= 1 ? 'eager' : 'lazy'}
                        onClick={toggleFullscreenZoom}
                      />
                    </figure>
                  ))}
                </div>
              ) : (
                <div
                  ref={fullscreenReaderRef}
                  onScroll={() => updateFullscreenIndexFromScroll('vertical')}
                  className="h-dvh overflow-y-auto overscroll-contain bg-black"
                >
                  {selectedWork.pages.map((page, index) => (
                    <figure key={`${page.path}-fullscreen`} className="bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={page.url}
                        alt={`${selectedWork.title} ${index + 1}ページ`}
                        className="block h-auto w-full cursor-zoom-in"
                        loading={Math.abs(index - fullscreenIndex) <= 1 ? 'eager' : 'lazy'}
                        onClick={toggleFullscreenZoom}
                      />
                    </figure>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </article>
      )}
    </div>
  )
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-4 w-4 border-b-[3px] border-current ${
        direction === 'left'
          ? 'rotate-45 border-l-[3px]'
          : '-rotate-45 border-r-[3px]'
      }`}
    />
  )
}

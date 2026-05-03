'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

type MusicTrack = {
  id: string
  title: string
  artist: string
  description: string
  createdAt: string
  sourceType: 'audio' | 'youtube'
  audio?: {
    path: string
    url: string
  }
  youtube?: {
    url: string
    embedUrl: string
  }
}

type MusicResponse = {
  tracks: MusicTrack[]
}

const controlHitbox =
  'absolute touch-manipulation select-none rounded-[10px] border border-transparent bg-transparent text-transparent outline-none transition duration-200 enabled:hover:border-[#b89558]/70 enabled:hover:bg-[#fffef8]/18 enabled:focus-visible:border-[#b89558] enabled:focus-visible:bg-[#fffef8]/22 disabled:cursor-not-allowed'

function VuMeter({ active }: { active: boolean }) {
  return (
    <div className="grid grid-cols-12 gap-1 border border-[#2b2d23] bg-[#e5d7a6] p-2 shadow-[inset_0_0_18px_rgba(73,53,12,0.38)]" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className={`h-5 border border-black/10 ${
            active && index < 8
              ? index > 8
                ? 'bg-[#c9482e]'
                : index > 5
                  ? 'bg-[#d6a939]'
                  : 'bg-[#547f4f]'
              : 'bg-[#726a45]/28'
          }`}
        />
      ))}
    </div>
  )
}

type MusicRoomProps = {
  variant?: 'full' | 'hero'
}

function getYoutubeVideoId(url?: string) {
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0] ?? null
    }

    if (parsed.pathname.includes('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split('/')[0] ?? null
    }

    return parsed.searchParams.get('v')
  } catch {
    return null
  }
}

function getTrackThumbnail(track?: MusicTrack) {
  const videoId = getYoutubeVideoId(track?.youtube?.url)
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null
}

export default function MusicRoom({ variant = 'full' }: MusicRoomProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const seekDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seekIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdActiveRef = useRef(false)
  const shouldAutoplayRef = useRef(false)
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let ignore = false

    fetch(`/api/music?refresh=${Date.now()}`, { cache: 'no-store' })
      .then((response) => response.json() as Promise<MusicResponse>)
      .then((data) => {
        if (!ignore) {
          setTracks(data.tracks ?? [])
          setSelectedId(data.tracks?.[0]?.id ?? null)
        }
      })
      .catch(() => {
        if (!ignore) {
          setTracks([])
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

  const selectedTrack = useMemo(
    () => tracks.find((track) => track.id === selectedId) ?? tracks[0],
    [selectedId, tracks],
  )
  const selectedIndex = useMemo(
    () => Math.max(0, tracks.findIndex((track) => track.id === selectedTrack?.id)),
    [selectedTrack?.id, tracks],
  )

  const isShort = selectedTrack?.youtube?.url.includes('/shorts/') ?? false
  const hasYoutube = Boolean(selectedTrack?.youtube)
  const canUseLocalAudio = selectedTrack?.sourceType === 'audio' && Boolean(selectedTrack.audio)
  const canUseCassetteControls = hasYoutube || canUseLocalAudio
  const selectedThumbnail = getTrackThumbnail(selectedTrack)

  function clearSeekHold() {
    if (seekDelayRef.current) {
      clearTimeout(seekDelayRef.current)
      seekDelayRef.current = null
    }

    if (seekIntervalRef.current) {
      clearInterval(seekIntervalRef.current)
      seekIntervalRef.current = null
    }
  }

  useEffect(() => clearSeekHold, [])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    audio.load()
  }, [selectedTrack?.id])

  function playAudio() {
    const audio = audioRef.current

    if (!audio || !canUseLocalAudio) return

    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }

  function playWhenReady() {
    if (!shouldAutoplayRef.current) return

    shouldAutoplayRef.current = false
    playAudio()
  }

  function stopAudio() {
    const audio = audioRef.current

    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }

  function openYoutubePlayback(track = selectedTrack) {
    if (!track?.youtube) return false

    const videoIsShort = track.youtube.url.includes('/shorts/')
    const popupWidth = videoIsShort ? 430 : 760
    const popupHeight = videoIsShort ? 760 : 520
    const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - popupWidth) / 2))
    const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - popupHeight) / 2))
    const popupFeatures = [
      'popup=yes',
      `width=${popupWidth}`,
      `height=${popupHeight}`,
      `left=${left}`,
      `top=${top}`,
      'resizable=yes',
      'scrollbars=yes',
      'noopener',
      'noreferrer',
    ].join(',')

    const popup = window.open(track.youtube.url, `zamakuri-youtube-${track.id}`, popupFeatures)
    popup?.focus()
    setIsPlaying(false)
    return true
  }

  function toggleAudio() {
    const audio = audioRef.current

    if (!audio || !canUseLocalAudio) {
      openYoutubePlayback()
      return
    }

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      return
    }

    audio.pause()
  }

  function seekAudio(seconds: number) {
    const audio = audioRef.current

    if (!audio || !canUseLocalAudio) return

    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds))
  }

  function startSeekHold(direction: -1 | 1) {
    clearSeekHold()
    holdActiveRef.current = false
    if (!canUseLocalAudio) return

    seekDelayRef.current = setTimeout(() => {
      holdActiveRef.current = true
      seekAudio(direction * 3)
      seekIntervalRef.current = setInterval(() => seekAudio(direction * 3), 180)
    }, 260)
  }

  function finishSeekPress(direction: -1 | 1) {
    const wasHolding = holdActiveRef.current

    clearSeekHold()
    holdActiveRef.current = false

    if (wasHolding) return

    selectRelativeTrack(direction)
  }

  function selectRelativeTrack(offset: -1 | 1) {
    if (tracks.length < 2) return

    clearSeekHold()
    stopAudio()
    const nextIndex = (selectedIndex + offset + tracks.length) % tracks.length
    const nextTrack = tracks[nextIndex]
    shouldAutoplayRef.current = Boolean(nextTrack.audio)
    setSelectedId(nextTrack.id)
    if (!nextTrack.audio) openYoutubePlayback(nextTrack)
  }

  function selectTrack(trackId: string, autoplay = true) {
    clearSeekHold()

    if (trackId === selectedTrack?.id) {
      if (autoplay) playAudio()
      return
    }

    stopAudio()
    const nextTrack = tracks.find((track) => track.id === trackId)
    shouldAutoplayRef.current = autoplay && Boolean(nextTrack?.audio)
    setSelectedId(trackId)
    if (autoplay && !nextTrack?.audio) openYoutubePlayback(nextTrack)
  }

  function openTrackSource(track: MusicTrack) {
    setSelectedId(track.id)
    stopAudio()
    openYoutubePlayback(track)
  }

  function handleTrackEnded() {
    setIsPlaying(false)

    if (tracks.length < 2) return

    const nextIndex = (selectedIndex + 1) % tracks.length
    const nextTrack = tracks[nextIndex]
    shouldAutoplayRef.current = Boolean(nextTrack.audio)
    setSelectedId(nextTrack.id)
    if (!nextTrack.audio) openYoutubePlayback(nextTrack)
  }

  if (isLoading) {
    return (
      <div className="border border-[#2c6a4b]/12 bg-white/78 px-5 py-16 text-center text-[#315244]/70">
        Loading the cassette deck.
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="border border-[#2c6a4b]/12 bg-white/78 p-8 shadow-[0_28px_90px_rgba(44,106,75,0.10)] md:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.28em] text-[#b89558]">NO TAPES YET</p>
        <h2 className="text-[clamp(2rem,5vw,4.2rem)] font-medium leading-tight text-[#10291e]">
          No music has been added yet.
        </h2>
        <p className="mt-7 max-w-2xl text-[15px] leading-8 text-[#315244]/76 md:text-lg md:leading-9">
          Upload audio from the admin page and it will appear here as a cassette.
        </p>
      </div>
    )
  }

  const player = selectedTrack ? (
    <article
      className={`overflow-hidden border border-[#2c6a4b]/14 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.92),transparent_38%),linear-gradient(145deg,rgba(255,254,248,0.96),rgba(237,248,233,0.92)_58%,rgba(217,255,216,0.74))] shadow-[0_32px_100px_rgba(44,106,75,0.14)] ${
        variant === 'hero' ? 'p-2.5 md:p-3' : 'p-3 md:p-5'
      }`}
    >
      <div className={`grid gap-3 ${variant === 'hero' ? 'mb-3' : 'mb-5 md:grid-cols-[1fr_220px]'}`}>
        <div className={`border border-[#2c6a4b]/12 bg-white/76 shadow-[inset_0_0_28px_rgba(255,255,255,0.72)] ${variant === 'hero' ? 'p-3' : 'p-4'}`}>
          <p className="text-[10px] font-black tracking-[0.22em] text-[#b89558]">NOW PLAYING</p>
          <div className={`mt-3 overflow-hidden border border-[#2c6a4b]/18 bg-[#f8fcf2] px-3 shadow-[inset_0_0_18px_rgba(44,106,75,0.06)] ${variant === 'hero' ? 'py-2' : 'py-3'}`}>
            <div className="np-marquee flex w-max whitespace-nowrap text-[12px] font-semibold leading-none tracking-[0.18em] text-[#173b2a] [text-shadow:0_0_10px_rgba(184,149,88,0.22)] md:text-sm">
              <span className="pr-14">{selectedTrack.title}</span>
              <span className="pr-14" aria-hidden="true">{selectedTrack.title}</span>
              <span className="pr-14" aria-hidden="true">{selectedTrack.title}</span>
            </div>
          </div>
          <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-[#2c6a4b]/78">{selectedTrack.artist}</p>
        </div>
        <div className={`content-between gap-3 border border-[#2c6a4b]/12 bg-white/76 p-3 ${variant === 'hero' ? 'hidden' : 'grid'}`}>
          <p className="text-[10px] font-black tracking-[0.18em] text-[#315244]/54">LEVEL METER</p>
          <VuMeter active={isPlaying} />
          <p className="text-[10px] tracking-[0.18em] text-[#315244]/44">{isPlaying ? 'ON AIR' : 'STAND BY'}</p>
        </div>
      </div>

      <div className={`relative mx-auto aspect-[1085/869] overflow-hidden ${variant === 'hero' ? 'max-w-[420px]' : 'max-w-[780px]'}`}>
        <Image
          src="/music/boombox-1980-anime-cutout.cropped.webp"
          alt=""
          fill
          className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.52)]"
          aria-hidden="true"
          sizes={variant === 'hero' ? '(max-width: 768px) 94vw, 420px' : '(max-width: 768px) 94vw, 780px'}
          priority={variant === 'hero'}
        />
        {selectedTrack.sourceType === 'audio' && selectedTrack.audio ? (
          <audio
            ref={audioRef}
            src={selectedTrack.audio.url}
            preload="metadata"
            onCanPlay={playWhenReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleTrackEnded}
          />
        ) : null}
        <div
          className="pointer-events-none absolute left-[39.6%] top-[41.8%] z-10 h-[20.5%] w-[20.8%] overflow-hidden rounded-[2px] border border-black/40 bg-[#111] text-center shadow-[inset_0_0_12px_rgba(0,0,0,0.55),0_0_12px_rgba(0,0,0,0.25)]"
          style={
            selectedThumbnail
              ? {
                  backgroundImage: `linear-gradient(180deg,rgba(5,8,6,0.05),rgba(5,8,6,0.62)),url(${selectedThumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.14),transparent_58%)]" />
          <p className="absolute inset-x-1 bottom-1 overflow-hidden bg-black/56 px-1 py-0.5 text-[clamp(0.32rem,1.05vw,0.54rem)] font-black leading-tight tracking-[0.02em] text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {selectedTrack.title}
          </p>
        </div>
        <button
          type="button"
          disabled
          aria-label="Record is disabled"
          title="Recording is disabled"
          className={`${controlHitbox} left-[2.2%] top-[81%] h-[14.6%] w-[15.4%]`}
        />
        <button
          type="button"
          onClick={toggleAudio}
          disabled={!canUseCassetteControls}
          aria-label={hasYoutube ? 'Play on YouTube' : 'Play or pause'}
          className={`${controlHitbox} left-[18.2%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
        <button
          type="button"
          onPointerDown={() => startSeekHold(-1)}
          onPointerUp={() => finishSeekPress(-1)}
          onPointerCancel={clearSeekHold}
          onPointerLeave={clearSeekHold}
          onContextMenu={(event) => event.preventDefault()}
          disabled={tracks.length < 2}
          aria-label="Previous track, hold to rewind local audio"
          className={`${controlHitbox} left-[32.8%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
        <button
          type="button"
          onPointerDown={() => startSeekHold(1)}
          onPointerUp={() => finishSeekPress(1)}
          onPointerCancel={clearSeekHold}
          onPointerLeave={clearSeekHold}
          onContextMenu={(event) => event.preventDefault()}
          disabled={tracks.length < 2}
          aria-label="Next track, hold to fast forward local audio"
          className={`${controlHitbox} left-[47.5%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
        <button
          type="button"
          onClick={stopAudio}
          disabled={!canUseLocalAudio}
          aria-label="Stop"
          className={`${controlHitbox} left-[62%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
        <button
          type="button"
          onClick={toggleAudio}
          disabled={!canUseCassetteControls}
          aria-label={hasYoutube ? 'Play on YouTube' : 'Play or pause'}
          className={`${controlHitbox} left-[77%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
      </div>

      {variant === 'hero' && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tracks.map((track, index) => {
            const thumbnail = getTrackThumbnail(track)

            return (
            <a
              key={track.id}
              href={track.youtube?.url ?? '#'}
              target={track.youtube ? '_blank' : undefined}
              rel={track.youtube ? 'noreferrer' : undefined}
              onClick={(event) => {
                event.preventDefault()

                if (!track.youtube) {
                  selectTrack(track.id)
                  return
                }

                openTrackSource(track)
              }}
              className={`group/tape relative min-h-16 overflow-hidden border bg-white px-3 py-2 text-left text-[10px] font-semibold leading-4 tracking-[0.08em] shadow-[0_10px_22px_rgba(44,106,75,0.08)] transition ${
                selectedTrack.id === track.id
                  ? 'border-[#143326] text-[#10291e] ring-1 ring-[#b89558]/70'
                  : 'border-[#2c6a4b]/10 text-[#315244]/70 hover:border-[#b89558]/42'
              }`}
            >
              <span
                className="absolute inset-0 bg-cover bg-center opacity-32 grayscale-[20%] saturate-[0.95] transition group-hover/tape:opacity-44"
                style={{
                  backgroundImage: thumbnail
                    ? `linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.16)),url(${thumbnail})`
                    : "url('/music/cassette-tape-card.webp')",
                }}
                aria-hidden="true"
              />
              <span className="absolute inset-0 bg-white/70" aria-hidden="true" />
              <span className="relative block text-[#b89558]">TAPE {String(index + 1).padStart(2, '0')}</span>
              <span className="relative mt-1 block truncate text-[11px] leading-4">{track.title}</span>
            </a>
          )})}
        </div>
      )}

      {variant === 'full' && (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            {selectedTrack.description && (
              <p className="text-[14px] leading-7 text-[#315244]/72">{selectedTrack.description}</p>
            )}
            {selectedTrack.youtube && (
              <a
                href={selectedTrack.youtube.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center border border-[#2c6a4b]/24 bg-white/56 px-5 text-xs font-semibold tracking-[0.16em] text-[#173b2a] transition hover:-translate-y-0.5 hover:border-[#b89558]/55 hover:bg-[#fffef8]"
              >
                OPEN ON YOUTUBE
              </a>
            )}
          </div>

          <div className="mt-5 border border-[#2c6a4b]/12 bg-white/54 p-3 md:p-4">
            {selectedTrack.sourceType === 'youtube' && selectedTrack.youtube ? (
              <div className={isShort ? 'mx-auto max-w-[340px]' : 'mx-auto max-w-[720px]'}>
                <div className={`relative overflow-hidden border border-[#2c6a4b]/12 bg-[#10291e] ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}>
                  <iframe
                    src={selectedTrack.youtube.embedUrl}
                    title={selectedTrack.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <a
                  href={selectedTrack.youtube.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-xs font-semibold tracking-[0.18em] text-[#2c6a4b]/78 transition hover:text-[#10291e]"
                >
                  OPEN ON YOUTUBE
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 border border-[#2c6a4b]/12 bg-white/58 px-4 py-3 text-[11px] tracking-[0.16em] text-[#315244]/68">
                <span>{isPlaying ? 'TAPE RUNNING' : 'TAPE READY'}</span>
                <span>MP3 AUDIO</span>
              </div>
            )}
          </div>

          {!canUseCassetteControls && (
            <p className="mt-4 text-center text-[11px] leading-5 text-[#315244]/50">
              YouTube tracks play in the embedded player. Double tap REW / FF to move between tracks.
            </p>
          )}
        </>
      )}
      <style jsx>{`
        .np-marquee {
          animation: np-marquee 18s linear infinite;
        }

        @keyframes np-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </article>
  ) : null

  if (variant === 'hero') {
    return <div id="cassette" className="scroll-mt-28">{player}</div>
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-[#2c6a4b]/12 bg-white/76 p-4 shadow-[0_24px_70px_rgba(44,106,75,0.10)]">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#2c6a4b]/12 pb-4">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">TAPE CASE</p>
            <span className="text-[11px] tracking-[0.18em] text-[#315244]/46">{tracks.length} TAPES</span>
          </div>
          <div className="grid gap-2">
            {tracks.map((track, index) => {
              const thumbnail = getTrackThumbnail(track)

              return (
              <a
                key={track.id}
                href={track.youtube?.url ?? '#'}
                target={track.youtube ? '_blank' : undefined}
                rel={track.youtube ? 'noreferrer' : undefined}
                onClick={(event) => {
                  event.preventDefault()

                  if (!track.youtube) {
                    selectTrack(track.id)
                    return
                  }

                  openTrackSource(track)
                }}
                className={`group/tape relative min-h-24 overflow-hidden border px-4 py-4 text-left shadow-[0_12px_28px_rgba(44,106,75,0.08)] transition duration-300 ${
                  selectedTrack?.id === track.id
                    ? 'border-[#143326] bg-white/90 text-[#10291e] ring-1 ring-[#b89558]/70'
                    : 'border-[#2c6a4b]/10 bg-white/52 text-[#315244]/72 hover:border-[#b89558]/42 hover:bg-white/82'
                }`}
              >
                <span
                  className="absolute inset-0 bg-cover bg-center opacity-32 grayscale-[20%] saturate-[0.95] transition group-hover/tape:opacity-44"
                  style={{
                    backgroundImage: thumbnail
                      ? `linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.16)),url(${thumbnail})`
                      : "url('/music/cassette-tape-card.webp')",
                  }}
                  aria-hidden="true"
                />
                <span className="absolute inset-0 bg-white/70" aria-hidden="true" />
                <span className="relative mb-3 block text-[10px] font-semibold tracking-[0.18em] text-[#b89558]">
                  SIDE A / {String(index + 1).padStart(2, '0')}
                </span>
                <span className="relative block text-sm font-semibold leading-6">{track.title}</span>
                <span className="relative mt-2 block text-[11px] tracking-[0.14em] text-[#315244]/48">
                  {track.sourceType === 'audio' && track.youtube ? 'LOCAL AUDIO + YOUTUBE META' : track.sourceType === 'audio' ? 'CASSETTE AUDIO' : 'VIDEO ARCHIVE'} / {track.artist}
                </span>
              </a>
            )})}
          </div>
        </div>
      </aside>

      {player}
    </div>
  )
}

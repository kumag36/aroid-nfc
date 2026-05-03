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
  const canUseCassetteControls = selectedTrack?.sourceType === 'audio' && Boolean(selectedTrack.audio)

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

    if (!audio || !canUseCassetteControls) return

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

  function toggleAudio() {
    const audio = audioRef.current

    if (!audio || !canUseCassetteControls) return

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      return
    }

    audio.pause()
  }

  function seekAudio(seconds: number) {
    const audio = audioRef.current

    if (!audio || !canUseCassetteControls) return

    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds))
  }

  function startSeekHold(direction: -1 | 1) {
    if (!canUseCassetteControls) return

    clearSeekHold()
    holdActiveRef.current = false
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
    shouldAutoplayRef.current = true
    const nextIndex = (selectedIndex + offset + tracks.length) % tracks.length
    setSelectedId(tracks[nextIndex].id)
  }

  function selectTrack(trackId: string, autoplay = true) {
    clearSeekHold()

    if (trackId === selectedTrack?.id) {
      if (autoplay) playAudio()
      return
    }

    stopAudio()
    shouldAutoplayRef.current = autoplay
    setSelectedId(trackId)
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
            onEnded={() => setIsPlaying(false)}
          />
        ) : null}
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
          aria-label="Play or pause"
          className={`${controlHitbox} left-[18.2%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
        <button
          type="button"
          onPointerDown={() => startSeekHold(-1)}
          onPointerUp={() => finishSeekPress(-1)}
          onPointerCancel={clearSeekHold}
          onPointerLeave={clearSeekHold}
          onContextMenu={(event) => event.preventDefault()}
          disabled={tracks.length < 2 && !canUseCassetteControls}
          aria-label="Hold to rewind, double tap for previous track"
          className={`${controlHitbox} left-[32.8%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
        <button
          type="button"
          onPointerDown={() => startSeekHold(1)}
          onPointerUp={() => finishSeekPress(1)}
          onPointerCancel={clearSeekHold}
          onPointerLeave={clearSeekHold}
          onContextMenu={(event) => event.preventDefault()}
          disabled={tracks.length < 2 && !canUseCassetteControls}
          aria-label="Hold to fast forward, double tap for next track"
          className={`${controlHitbox} left-[47.5%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
        <button
          type="button"
          onClick={stopAudio}
          disabled={!canUseCassetteControls}
          aria-label="Stop"
          className={`${controlHitbox} left-[62%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
        <button
          type="button"
          onClick={toggleAudio}
          disabled={!canUseCassetteControls}
          aria-label="Play or pause"
          className={`${controlHitbox} left-[77%] top-[80.8%] h-[15.4%] w-[14.4%]`}
        />
      </div>

      {variant === 'hero' && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tracks.map((track, index) => (
            <button
              key={track.id}
              type="button"
              onClick={() => selectTrack(track.id)}
              className={`min-h-10 border px-2.5 text-left text-[10px] font-semibold leading-4 tracking-[0.12em] transition ${
                selectedTrack.id === track.id
                  ? 'border-[#2c6a4b]/32 bg-white/88 text-[#10291e] shadow-[inset_3px_0_0_#b89558]'
                  : 'border-[#2c6a4b]/10 bg-white/42 text-[#315244]/66 hover:border-[#2c6a4b]/24 hover:bg-white/72'
              }`}
            >
              <span className="block text-[#b89558]">TAPE {String(index + 1).padStart(2, '0')}</span>
              <span className="block truncate">{track.title}</span>
            </button>
          ))}
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
            {tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                onClick={() => selectTrack(track.id)}
                className={`group border px-4 py-4 text-left transition duration-300 ${
                  selectedTrack?.id === track.id
                    ? 'border-[#2c6a4b]/32 bg-white/88 text-[#10291e] shadow-[inset_4px_0_0_#b89558]'
                    : 'border-[#2c6a4b]/10 bg-white/42 text-[#315244]/72 hover:border-[#2c6a4b]/26 hover:bg-white/72'
                }`}
              >
                <span className="mb-3 block text-[10px] font-semibold tracking-[0.18em] text-[#b89558]">
                  SIDE A / {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block text-sm font-semibold leading-6">{track.title}</span>
                <span className="mt-2 block text-[11px] tracking-[0.14em] text-[#315244]/48">
                  {track.sourceType === 'audio' && track.youtube ? 'LOCAL AUDIO + YOUTUBE META' : track.sourceType === 'audio' ? 'CASSETTE AUDIO' : 'VIDEO ARCHIVE'} / {track.artist}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {player}
    </div>
  )
}

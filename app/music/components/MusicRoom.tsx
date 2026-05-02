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

const buttonBase =
  'min-h-11 border border-[#161a13] bg-[linear-gradient(180deg,#fff5d8_0%,#a99b81_45%,#4d483d_100%)] px-2 text-[10px] font-black tracking-[0.12em] text-[#11150f] shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-4px_0_rgba(0,0,0,0.24),0_6px_0_#10130f,0_10px_16px_rgba(0,0,0,0.3)] transition duration-150 enabled:active:translate-y-1 enabled:active:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-2px_0_rgba(0,0,0,0.24),0_2px_0_#10130f,0_7px_12px_rgba(0,0,0,0.28)] disabled:cursor-not-allowed disabled:opacity-45'

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

export default function MusicRoom() {
  const audioRef = useRef<HTMLAudioElement>(null)
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

  const isShort = selectedTrack?.youtube?.url.includes('/shorts/') ?? false
  const canUseCassetteControls = selectedTrack?.sourceType === 'audio' && Boolean(selectedTrack.audio)

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

  function stopAudio() {
    const audio = audioRef.current

    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }

  function seekAudio(seconds: number) {
    const audio = audioRef.current

    if (!audio || !canUseCassetteControls) return

    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds))
  }

  if (isLoading) {
    return (
      <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 px-5 py-16 text-center text-[#d8d0bf]/70">
        Loading the cassette deck.
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.28em] text-[#b89558]">NO TAPES YET</p>
        <h2 className="text-[clamp(2rem,5vw,4.2rem)] font-medium leading-tight text-[#fffaf0]">
          まだ音源がありません。
        </h2>
        <p className="mt-7 max-w-2xl text-[15px] leading-8 text-[#d8d0bf]/76 md:text-lg md:leading-9">
          管理画面から音源を追加すると、ここにカセットとして並びます。
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-[#fffaf0]/10 bg-[#07120d]/88 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#fffaf0]/10 pb-4">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">TAPE CASE</p>
            <span className="text-[11px] tracking-[0.18em] text-[#d8d0bf]/46">{tracks.length} TAPES</span>
          </div>
          <div className="grid gap-2">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedId(track.id)}
                className={`group border px-4 py-4 text-left transition duration-300 ${
                  selectedTrack?.id === track.id
                    ? 'border-[#d9ffd8]/60 bg-[#d9ffd8]/12 text-[#fffaf0] shadow-[inset_4px_0_0_#d9ffd8]'
                    : 'border-[#fffaf0]/10 bg-[#fffaf0]/4 text-[#d8d0bf]/72 hover:border-[#d9ffd8]/30'
                }`}
              >
                <span className="mb-3 block text-[10px] font-semibold tracking-[0.18em] text-[#b89558]">
                  SIDE A / {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block text-sm font-semibold leading-6">{track.title}</span>
                <span className="mt-2 block text-[11px] tracking-[0.14em] text-[#d8d0bf]/48">
                  {track.sourceType === 'audio' ? 'CASSETTE AUDIO' : 'VIDEO ARCHIVE'} / {track.artist}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {selectedTrack && (
        <article className="overflow-hidden border border-[#fffaf0]/10 bg-[radial-gradient(circle_at_50%_0%,rgba(217,255,216,0.08),transparent_36%),linear-gradient(145deg,#11170f,#050806_58%,#17150f)] p-3 shadow-[0_38px_120px_rgba(0,0,0,0.42)] md:p-5">
          <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="border border-[#fffaf0]/10 bg-[#050806]/82 p-4 shadow-[inset_0_0_30px_rgba(0,0,0,0.48)]">
              <p className="text-[10px] font-black tracking-[0.22em] text-[#b89558]">NOW PLAYING</p>
              <h2 className="mt-3 text-[clamp(1.45rem,4vw,2.8rem)] font-semibold leading-tight text-[#fffaf0]">
                {selectedTrack.title}
              </h2>
              <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-[#d9ffd8]/78">{selectedTrack.artist}</p>
            </div>
            <div className="grid content-between gap-3 border border-[#fffaf0]/10 bg-[#050806]/82 p-3">
              <p className="text-[10px] font-black tracking-[0.18em] text-[#d8d0bf]/54">LEVEL METER</p>
              <VuMeter active={isPlaying} />
              <p className="text-[10px] tracking-[0.18em] text-[#d8d0bf]/44">{isPlaying ? 'ON AIR' : 'STAND BY'}</p>
            </div>
          </div>

          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden">
            <Image
              src="/music/boombox-1980.svg"
              alt=""
              fill
              className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.52)]"
              aria-hidden="true"
            />
            {selectedTrack.sourceType === 'audio' && selectedTrack.audio ? (
              <audio
                ref={audioRef}
                src={selectedTrack.audio.url}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            ) : null}
            <div className="absolute left-[28%] top-[82%] grid w-[48%] grid-cols-5 gap-[3.6%]">
              <button type="button" disabled className={buttonBase} title="Recording is disabled">
                REC
              </button>
              <button type="button" onClick={() => seekAudio(-15)} disabled={!canUseCassetteControls} className={buttonBase}>
                REW
              </button>
              <button type="button" onClick={playAudio} disabled={!canUseCassetteControls} className={`${buttonBase} !bg-[linear-gradient(180deg,#d9ffd8_0%,#8fc98c_48%,#3d6c44_100%)]`}>
                PLAY
              </button>
              <button type="button" onClick={stopAudio} disabled={!canUseCassetteControls} className={buttonBase}>
                STOP
              </button>
              <button type="button" onClick={() => seekAudio(15)} disabled={!canUseCassetteControls} className={buttonBase}>
                FF
              </button>
            </div>
          </div>

          {selectedTrack.description && (
            <p className="mt-6 text-[14px] leading-7 text-[#d8d0bf]/72">{selectedTrack.description}</p>
          )}

          <div className="mt-5 border border-[#141711] bg-[#030504] p-3 md:p-4">
            {selectedTrack.sourceType === 'youtube' && selectedTrack.youtube ? (
              <div className={isShort ? 'mx-auto max-w-[340px]' : 'mx-auto max-w-[720px]'}>
                <div className={`relative overflow-hidden border border-[#fffaf0]/10 bg-black ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}>
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
                  className="mt-5 inline-flex text-xs font-semibold tracking-[0.18em] text-[#d9ffd8]/78 transition hover:text-[#d9ffd8]"
                >
                  OPEN ON YOUTUBE
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 border border-[#fffaf0]/10 bg-[#fffaf0]/5 px-4 py-3 text-[11px] tracking-[0.16em] text-[#d8d0bf]/68">
                <span>{isPlaying ? 'TAPE RUNNING' : 'TAPE READY'}</span>
                <span>MP3 AUDIO</span>
              </div>
            )}
          </div>

          {!canUseCassetteControls && (
            <p className="mt-4 text-center text-[11px] leading-5 text-[#d8d0bf]/50">
              YouTube展示は埋め込みプレイヤーで再生します。アップロード音源はラジカセボタンで操作できます。
            </p>
          )}
        </article>
      )}
    </div>
  )
}

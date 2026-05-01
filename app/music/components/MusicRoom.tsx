'use client'

import { useEffect, useMemo, useState } from 'react'

type MusicTrack = {
  id: string
  title: string
  artist: string
  description: string
  createdAt: string
  audio: {
    path: string
    url: string
  }
}

type MusicResponse = {
  tracks: MusicTrack[]
}

export default function MusicRoom() {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    fetch('/api/music', { cache: 'no-store' })
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

  if (isLoading) {
    return (
      <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 px-5 py-16 text-center text-[#d8d0bf]/70">
        音楽室の空気を整えています。
      </div>
    )
  }

  if (tracks.length === 0) {
    return (
      <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-12">
        <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">NO TRACKS YET</p>
        <h2 className="text-[clamp(2rem,5vw,4.2rem)] font-medium leading-tight text-[#fffaf0]">
          まだ音源はありません。
        </h2>
        <p className="mt-7 max-w-2xl text-[15px] leading-8 text-[#d8d0bf]/76 md:text-lg md:leading-9">
          管理者ページから音源をアップすると、ここに静かな音楽室として並びます。
          試作曲、鼻歌、植物に聴かせたい音まで置けます。
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">
            PLAYLIST / {tracks.length}
          </p>
          <div className="grid gap-2">
            {tracks.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedId(track.id)}
                className={`border px-4 py-4 text-left transition duration-300 ${
                  selectedTrack?.id === track.id
                    ? 'border-[#d9ffd8]/55 bg-[#d9ffd8]/10 text-[#fffaf0]'
                    : 'border-[#fffaf0]/10 bg-[#fffaf0]/4 text-[#d8d0bf]/72 hover:border-[#d9ffd8]/30'
                }`}
              >
                <span className="block text-sm font-semibold leading-6">{track.title}</span>
                <span className="mt-2 block text-[11px] tracking-[0.14em] text-[#d8d0bf]/48">
                  {track.artist}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {selectedTrack && (
        <article className="border border-[#fffaf0]/10 bg-[#07120d]/86 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-8">
          <p className="mb-5 text-[11px] font-semibold tracking-[0.28em] text-[#b89558]">LISTENING ROOM</p>
          <h2 className="text-[clamp(2rem,5vw,4.8rem)] font-medium leading-tight text-[#fffaf0]">
            {selectedTrack.title}
          </h2>
          <p className="mt-4 text-xs font-semibold tracking-[0.22em] text-[#d9ffd8]/78">
            {selectedTrack.artist}
          </p>
          {selectedTrack.description && (
            <p className="mt-7 max-w-3xl text-[15px] leading-8 text-[#d8d0bf]/76 md:text-lg md:leading-9">
              {selectedTrack.description}
            </p>
          )}

          <div className="mt-10 border border-[#fffaf0]/10 bg-[#050806]/72 p-4 md:p-6">
            <audio controls src={selectedTrack.audio.url} className="w-full" />
          </div>
        </article>
      )}
    </div>
  )
}

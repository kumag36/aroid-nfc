'use client'

import Image from 'next/image'
import { type CSSProperties, useEffect, useState } from 'react'

const mascotAssets = ['owner', 'frog', 'cat'].flatMap((character) =>
  Array.from(
    { length: 40 },
    (_, index) => `/mascots/${character}-${String(index + 1).padStart(3, '0')}.webp`,
  ),
)

const positions = [
  'right-[2vw] top-[16vh]',
  'left-[2vw] top-[44vh]',
  'right-[4vw] bottom-[9vh]',
  'left-[6vw] bottom-[10vh]',
  'right-[13vw] top-[58vh]',
  'left-[13vw] top-[18vh]',
  'right-[19vw] bottom-[22vh]',
]

const sizes = ['w-20', 'w-24', 'w-28', 'w-32', 'w-36']

type Mascot = {
  id: string
  src: string
  position: string
  size: string
  delay: string
  rotate: string
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function pickExcept<T>(items: T[], excluded: T[]) {
  const available = items.filter((item) => !excluded.includes(item))
  return pick(available.length ? available : items)
}

function createMascots(): Mascot[] {
  const count = 3 + Math.floor(Math.random() * 2)
  const availablePositions = [...positions].sort(() => Math.random() - 0.5)
  const availableAssets = [...mascotAssets].sort(() => Math.random() - 0.5)

  return Array.from({ length: count }, (_, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
    src: availableAssets[index],
    position: availablePositions[index % availablePositions.length],
    size: pick(sizes),
    delay: `${(Math.random() * -4).toFixed(2)}s`,
    rotate: `${Math.round(Math.random() * 16 - 8)}deg`,
  }))
}

function createReplacement(current: Mascot[], targetIndex: number): Mascot {
  const usedSources = current
    .filter((_, index) => index !== targetIndex)
    .map((mascot) => mascot.src)
  const usedPositions = current
    .filter((_, index) => index !== targetIndex)
    .map((mascot) => mascot.position)

  return {
    id: `${Date.now()}-${targetIndex}-${Math.random().toString(36).slice(2)}`,
    src: pickExcept(mascotAssets, usedSources),
    position: pickExcept(positions, usedPositions),
    size: pick(sizes),
    delay: `${(Math.random() * -4).toFixed(2)}s`,
    rotate: `${Math.round(Math.random() * 16 - 8)}deg`,
  }
}

export default function MascotSprinkles() {
  const [mascots, setMascots] = useState<Mascot[]>([])

  useEffect(() => {
    let timer: number

    const replaceOne = () => {
      setMascots((current) => {
        if (!current.length) {
          return createMascots()
        }

        const targetIndex = Math.floor(Math.random() * current.length)

        return current.map((mascot, index) => {
          return index === targetIndex ? createReplacement(current, targetIndex) : mascot
        })
      })
      timer = window.setTimeout(replaceOne, 1600 + Math.random() * 1800)
    }

    timer = window.setTimeout(replaceOne, 80)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  function handleMascotClick(targetIndex: number) {
    setMascots((current) =>
      current.map((mascot, index) => (index === targetIndex ? createReplacement(current, targetIndex) : mascot)),
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden overflow-hidden xl:block" aria-hidden="true">
      {mascots.map((mascot, index) => (
        <div
          key={mascot.id}
          className={`zmk-mascot-sticker pointer-events-auto absolute select-none ${mascot.position} ${mascot.size}`}
          style={
            {
              '--zmk-mascot-rotate': mascot.rotate,
              animationDelay: mascot.delay,
            } as CSSProperties
          }
          role="button"
          tabIndex={0}
          onClick={() => handleMascotClick(index)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              handleMascotClick(index)
            }
          }}
        >
          <Image
            src={mascot.src}
            alt=""
            width={360}
            height={360}
            sizes="140px"
            className="h-auto w-full"
          />
        </div>
      ))}
    </div>
  )
}

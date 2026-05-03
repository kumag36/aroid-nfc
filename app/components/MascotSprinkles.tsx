'use client'

import Image from 'next/image'
import { type CSSProperties, useEffect, useState } from 'react'

const mascotAssets = Array.from(
  { length: 48 },
  (_, index) => `/mascots/icon-${String(index + 1).padStart(3, '0')}.webp`,
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

const sizes = ['w-16', 'w-20', 'w-24', 'w-28', 'w-32']

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

function createMascots(): Mascot[] {
  const count = 2 + Math.floor(Math.random() * 3)
  const availablePositions = [...positions].sort(() => Math.random() - 0.5)

  return Array.from({ length: count }, (_, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
    src: pick(mascotAssets),
    position: availablePositions[index % availablePositions.length],
    size: pick(sizes),
    delay: `${(Math.random() * -4).toFixed(2)}s`,
    rotate: `${Math.round(Math.random() * 16 - 8)}deg`,
  }))
}

export default function MascotSprinkles() {
  const [mascots, setMascots] = useState<Mascot[]>([])

  useEffect(() => {
    let timer: number

    const shuffle = () => {
      setMascots(createMascots())
      timer = window.setTimeout(shuffle, 3400 + Math.random() * 3000)
    }

    shuffle()

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden overflow-hidden xl:block" aria-hidden="true">
      {mascots.map((mascot) => (
        <div
          key={mascot.id}
          className={`zmk-mascot-sticker pointer-events-auto absolute select-none ${mascot.position} ${mascot.size}`}
          style={
            {
              '--zmk-mascot-rotate': mascot.rotate,
              animationDelay: mascot.delay,
            } as CSSProperties
          }
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

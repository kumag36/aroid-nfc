import Image from 'next/image'

const mascots = [
  {
    src: '/mascots/zamakuri-team.webp',
    alt: '',
    className: 'right-[4vw] top-[24vh] w-28 opacity-[0.20] md:w-40 lg:w-52',
    delay: '0s',
  },
  {
    src: '/mascots/kaeru-kun.webp',
    alt: '',
    className: 'left-[3vw] top-[62vh] w-16 opacity-[0.18] md:w-24',
    delay: '1.8s',
  },
  {
    src: '/mascots/kuro-chan.webp',
    alt: '',
    className: 'right-[9vw] bottom-[7vh] w-14 opacity-[0.18] md:w-20',
    delay: '3.2s',
  },
]

export default function MascotSprinkles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {mascots.map((mascot) => (
        <div
          key={mascot.src}
          className={`zmk-mascot-float absolute hidden select-none sm:block ${mascot.className}`}
          style={{ animationDelay: mascot.delay }}
        >
          <Image
            src={mascot.src}
            alt={mascot.alt}
            width={360}
            height={360}
            sizes="220px"
            className="h-auto w-full drop-shadow-[0_22px_44px_rgba(44,106,75,0.18)]"
          />
        </div>
      ))}
    </div>
  )
}

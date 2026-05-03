import Image from 'next/image'
import BrandHeader from '@/app/components/BrandHeader'
import MusicRoom from './components/MusicRoom'

export const metadata = {
  title: 'ざまくり音楽室 | ZAMAKURI.JP',
  description:
    'ざまくりプランツの音源を、白と緑を基調にしたラジカセUIで聴ける音楽室。',
}

export default function MusicPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />

      <section className="zmk-hero">
        <Image src="/history/hero-botanical.png" alt="" fill priority className="zmk-hero-media" sizes="100vw" />
        <div className="zmk-hero-shade" />
        <div className="zmk-hero-fade" />
        <div className="zmk-container relative z-10 grid gap-10 lg:min-h-[68vh] lg:grid-cols-[minmax(0,0.86fr)_minmax(420px,0.8fr)] lg:items-center">
          <div>
            <div className="zmk-rule" />
            <p className="zmk-eyebrow mb-5">ZAMAKURI MUSIC ROOM</p>
            <h1 className="zmk-title">
              ざまくり
              <span className="block">音楽室</span>
            </h1>
            <p className="zmk-lead mt-8">
              植物のそばに置いた音、作りかけの音、ふと思いついた旋律を静かに保管する部屋です。
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#cassette" className="zmk-button zmk-button-primary">
                音楽を聴く
              </a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[560px] lg:ml-auto">
            <MusicRoom variant="hero" />
          </div>
        </div>
      </section>
    </main>
  )
}

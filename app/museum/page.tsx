import Image from 'next/image'
import BrandHeader from '@/app/components/BrandHeader'
import MuseumGallery from './components/MuseumGallery'

export const metadata = {
  title: 'ざまくり漫画室 | ZAMAKURI.JP',
  description:
    'ざまくりプランツの漫画作品を、スマホは縦読み、タブレットとPCは横読みで楽しめる漫画室。',
}

export default function MuseumPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />

      <section className="zmk-hero">
        <Image src="/history/hero-botanical.png" alt="" fill priority className="zmk-hero-media" sizes="100vw" />
        <div className="zmk-hero-shade" />
        <div className="zmk-hero-fade" />
        <div className="zmk-container zmk-hero-body">
          <div className="zmk-rule" />
          <p className="zmk-eyebrow mb-5">ZAMAKURI MANGA ROOM</p>
          <h1 className="zmk-title">
            ざまくり
            <span className="block">漫画室</span>
          </h1>
          <p className="zmk-lead mt-8">
            気ままに描いた漫画を、ピッコマのように軽く読める部屋です。スマホは縦読み、タブレットとPCは横読みで表示します。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#gallery" className="zmk-button zmk-button-primary">
              作品を読む
            </a>
          </div>
        </div>
      </section>

      <section id="gallery" className="zmk-section">
        <div className="zmk-container">
          <MuseumGallery />
        </div>
      </section>
    </main>
  )
}

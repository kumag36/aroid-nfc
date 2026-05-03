import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
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

      <PageHero
        eyebrow="ZAMAKURI MANGA ROOM"
        title={
          <>
            ざまくり
            <span className="block">漫画室</span>
          </>
        }
        lead="気ままに描いた漫画を、ピッコマのように軽く読める部屋です。スマホは縦読み、タブレットとPCは横読みで表示します。"
        actions={
          <a href="#gallery" className="zmk-button zmk-button-primary">
            作品を読む
          </a>
        }
      />

      <section id="gallery" className="zmk-section">
        <div className="zmk-container">
          <MuseumGallery />
        </div>
      </section>
    </main>
  )
}

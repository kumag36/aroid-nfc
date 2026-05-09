import BrandHeader from '@/app/components/BrandHeader'
import MusicRoom from '@/app/music/components/MusicRoom'
import { listMusicTracks } from '@/lib/music-storage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '音楽置き場 | ZAMAKURI.JP',
  description: 'ざまくりプランツの音楽置き場。ラジカセでローカル音源を再生できます。',
}

export default async function LabPage() {
  const tracks = await listMusicTracks().catch(() => [])

  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="zmk-public-hero px-5 pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="zmk-eyebrow mb-4">ZAMAKURI LAB</p>
          <h1>物置</h1>
          <p className="mt-3 text-lg font-bold text-[var(--zmk-ink-soft)]">音楽置き場</p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] font-bold leading-8 text-[var(--zmk-ink-soft)]">
            ラジカセのボタンで再生、曲送り。下のカセットで YouTube を開けます。
          </p>
        </div>
      </section>
      <section className="px-5 pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <MusicRoom variant="hero" initialTracks={tracks} />
          <p className="mt-4 text-sm font-bold text-[var(--zmk-ink-soft)]">ラジカセのボタンで再生、曲送り、ラジカセ下のボタンでYouTubeを開けます。</p>
        </div>
      </section>
    </main>
  )
}

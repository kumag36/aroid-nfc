import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import MuseumGallery from '@/app/museum/components/MuseumGallery'
import { listMusicTracks } from '@/lib/music-storage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '物置（ZAMAKURI LAB） | ZAMAKURI.JP',
  description: 'ざまくりプランツの物置。遊びと実験の記録。',
}

export default async function LabPage() {
  const tracks = await listMusicTracks().catch(() => [])
  const youtubeUrl = tracks.find((track) => track.youtube?.url)?.youtube?.url ?? 'https://youtube.com/shorts/fuP2yNTE08g'

  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="px-5 pb-12 pt-32 sm:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="zmk-eyebrow mb-4 text-[#b89558]">ZAMAKURI LAB</p>
          <h1 className="text-[#10291e]">物置</h1>
          <p className="mt-4 text-lg font-bold text-[#315244]">遊びと実験の記録</p>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-8 text-[#315244]">
            ここはざまくりの裏側。音楽、マンガ、実験。ちょっと寄り道したい人だけどうぞ。
          </p>
        </div>
      </section>
      <section className="px-5 pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <a href={youtubeUrl} target="_blank" rel="noreferrer" className="group block active:scale-[0.96] active:opacity-80" aria-label="YouTubeで音楽を開く">
            <Image src="/music/boombox-1980-anime-cutout.cropped.webp" alt="ラジカセ" width={900} height={560} priority className="mx-auto h-auto w-full max-w-[620px]" />
          </a>
          <p className="mt-4 text-sm font-bold text-[#315244]">ラジカセを押すとYouTubeで開きます。音は外、体験は中。</p>
        </div>
      </section>
      <section id="manga" className="bg-white px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="zmk-eyebrow mb-3 text-[#b89558]">MANGA ROOM</p>
              <h2 className="text-[#10291e]">漫画部屋</h2>
            </div>
            <p className="text-sm font-bold text-[#315244]">🎧 音楽を流しながらどうぞ</p>
          </div>
          <MuseumGallery />
          <div className="mt-8">
            <Link href="/about" className="zmk-button">ショップ情報へ戻る</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
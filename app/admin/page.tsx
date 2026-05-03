import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import { plants } from '@/lib/dictionary-data'
import { dictionaryImageCandidates } from '@/lib/dictionary-image-data'
import {
  getDictionaryImageAdminReady,
  listDictionaryImageAssignments,
  listDictionaryImageExclusions,
} from '@/lib/dictionary-image-storage'
import { listMuseumWorks } from '@/lib/museum-storage'
import { listMusicTracks } from '@/lib/music-storage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '管理室 | ZAMAKURI.JP',
  robots: {
    index: false,
    follow: false,
  },
}

const adminLinks = [
  {
    href: '/dictionary/admin/images',
    eyebrow: 'IMAGE SORTING',
    title: '図鑑写真の区分け',
    body: '抽出済み画像を、品種ごとに確認・採用・除外します。写真整理はここから始めます。',
    primary: true,
  },
  {
    href: '/music/admin',
    eyebrow: 'MUSIC UPLOAD',
    title: '音楽室へ曲を追加',
    body: 'MP3とYouTube情報を統合し、ラジカセUIの再生リストへ反映します。',
  },
  {
    href: '/museum/admin',
    eyebrow: 'MUSEUM UPLOAD',
    title: '美術館へ作品を追加',
    body: '漫画や画像作品をアップロードし、スマホ縦読み展示へ並べます。',
  },
  {
    href: '/nfc/verify',
    eyebrow: 'NFC LAB',
    title: 'NFCタグ検証',
    body: 'NFC Toolsで書き込むURL、登録済み判定、未登録時の導線を確認します。',
  },
]

function StatCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <article className="border border-[#2c6a4b]/10 bg-white/86 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
      <p className="text-[11px] font-semibold tracking-[0.2em] text-[#b89558]">{label}</p>
      <p className="mt-4 text-3xl font-medium text-[#143326]">{value}</p>
      <p className="mt-3 text-[13px] leading-7 text-[#315244]/70">{detail}</p>
    </article>
  )
}

export default async function AdminPage() {
  const [assignments, exclusions, musicTracks, museumWorks] = await Promise.all([
    listDictionaryImageAssignments(),
    listDictionaryImageExclusions(),
    listMusicTracks().catch(() => []),
    listMuseumWorks().catch(() => []),
  ])
  const pendingImages = Math.max(dictionaryImageCandidates.length - assignments.length - exclusions.length, 0)

  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:var(--font-zamakuri)]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_82%_18%,rgba(217,255,216,0.12),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">HIDDEN ADMIN ROOM</p>
          <h1 className="max-w-5xl text-[clamp(2.55rem,7vw,6.2rem)] font-medium leading-[1.08] tracking-normal">
            管理機能を
            <span className="block">ここに集約する。</span>
          </h1>
          <p className="mt-8 max-w-3xl text-[15px] leading-8 text-[#315244]/82 md:text-lg md:leading-9">
            表のサイトには出さない、ざまくりプランツの作業室です。図鑑写真の区分け、音楽室、美術館、NFC検証をここから直接扱えます。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <StatCard label="写真 未確認" value={pendingImages} detail="採用・除外が必要な図鑑候補画像。" />
          <StatCard label="写真 採用済み" value={assignments.length} detail="図鑑へ紐づけ済みの画像。" />
          <StatCard label="図鑑 品種" value={plants.length} detail="現在公開中の品種データ。" />
          <StatCard label="音楽室" value={musicTracks.length} detail="登録済みトラック数。" />
          <StatCard label="美術館" value={museumWorks.length} detail="展示中の作品数。" />
        </div>

        {!getDictionaryImageAdminReady() && (
          <div className="mt-6 border border-[#b89558]/40 bg-[#b89558]/10 p-5 text-[13px] leading-7 text-[#f1dfb8]">
            図鑑画像管理の保存先が未設定です。SupabaseのStorage設定と管理パスワードを確認してください。
          </div>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {adminLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'group block border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1',
                item.primary
                  ? 'border-[#d9ffd8]/45 bg-[#d9ffd8]/10'
                  : 'border-[#2c6a4b]/10 bg-white/86 hover:border-[#d9ffd8]/35',
              ].join(' ')}
            >
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">{item.eyebrow}</p>
              <h2 className="mt-5 text-2xl font-medium leading-tight text-[#143326] md:text-3xl">{item.title}</h2>
              <p className="mt-5 text-[15px] leading-8 text-[#315244]/76">{item.body}</p>
              <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-[#d9ffd8] transition group-hover:translate-x-1">
                OPEN
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

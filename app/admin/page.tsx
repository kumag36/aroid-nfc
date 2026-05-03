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
    eyebrow: 'DICTIONARY IMAGE',
    title: '図鑑代表画像を選ぶ',
    body: '品種ごとの代表画像とギャラリー画像を設定します。代表画像は図鑑カードと詳細ページで優先表示されます。',
    primary: true,
  },
  {
    href: '/music/admin',
    eyebrow: 'MUSIC UPLOAD',
    title: '音楽室へ曲を追加',
    body: 'MP3とYouTube情報を登録し、ラジカセUIの再生リストに反映します。',
  },
  {
    href: '/museum/admin',
    eyebrow: 'MUSEUM UPLOAD',
    title: '美術館へ作品を追加',
    body: '漫画や画像作品をアップロードし、スマホでも読みやすい展示へ並べます。',
  },
  {
    href: '/nfc/verify',
    eyebrow: 'NFC LAB',
    title: 'NFCタグ検証',
    body: 'NFC Toolsで書き込むURL、登録済み判定、未登録時の案内を確認します。',
  },
]

function StatCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <article className="border border-[#2c6a4b]/10 bg-white/88 p-5 shadow-[0_20px_70px_rgba(44,106,75,0.1)] dark:border-[#d9ffd8]/14 dark:bg-[#10291e]/86">
      <p className="text-[11px] font-semibold tracking-[0.2em] text-[#b89558]">{label}</p>
      <p className="mt-4 text-3xl font-bold text-[#143326] dark:text-[#f7fbf1]">{value}</p>
      <p className="mt-3 text-[13px] leading-7 text-[#315244]/76 dark:text-[#d9ffd8]/76">{detail}</p>
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
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:var(--font-zamakuri)] dark:bg-[#07110c] dark:text-[#f7fbf1]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_82%_18%,rgba(217,255,216,0.72),transparent_34%),linear-gradient(135deg,#fffef8_0%,#f7fbf1_52%,#d9ffd8_100%)] px-5 pb-14 pt-32 dark:bg-[radial-gradient(circle_at_82%_18%,rgba(217,255,216,0.18),transparent_34%),linear-gradient(135deg,#07110c_0%,#10291e_58%,#07110c_100%)] md:pb-20 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">HIDDEN ADMIN ROOM</p>
          <h1 className="max-w-5xl text-[clamp(2.55rem,7vw,6.2rem)] font-bold leading-[1.08] tracking-normal text-[#143326] dark:text-[#f7fbf1]">
            管理機能を
            <span className="block">ここに集約する。</span>
          </h1>
          <p className="mt-8 max-w-3xl text-[15px] leading-8 text-[#315244]/82 dark:text-[#d9ffd8]/82 md:text-lg md:leading-9">
            表のサイトには出さない、ざまくりプランツの作業室です。図鑑写真の代表画像設定、音楽室、美術館、NFC検証をここから扱います。
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
          <div className="mt-6 border border-[#b89558]/40 bg-[#fff9e8] p-5 text-[13px] leading-7 text-[#8a6a2f] dark:bg-[#b89558]/10 dark:text-[#f1dfb8]">
            図鑑画像管理の保存先が未設定です。Supabase Storage と管理用環境変数を確認してください。
          </div>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {adminLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'group block border p-6 shadow-[0_24px_80px_rgba(44,106,75,0.1)] transition duration-300 hover:-translate-y-1 dark:shadow-[0_24px_80px_rgba(0,0,0,0.26)]',
                item.primary
                  ? 'border-[#2c6a4b]/28 bg-[#d9ffd8]/40 dark:border-[#d9ffd8]/36 dark:bg-[#d9ffd8]/10'
                  : 'border-[#2c6a4b]/10 bg-white/88 hover:border-[#b89558]/35 dark:border-[#d9ffd8]/12 dark:bg-[#10291e]/86 dark:hover:border-[#b89558]/50',
              ].join(' ')}
            >
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[#b89558]">{item.eyebrow}</p>
              <h2 className="mt-5 text-2xl font-bold leading-tight text-[#143326] dark:text-[#f7fbf1] md:text-3xl">{item.title}</h2>
              <p className="mt-5 text-[15px] leading-8 text-[#315244]/76 dark:text-[#d9ffd8]/76">{item.body}</p>
              <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-[#2c6a4b] transition group-hover:translate-x-1 dark:text-[#d9ffd8]">
                OPEN
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
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
    eyebrow: 'MANGA UPLOAD',
    title: '漫画部屋へ作品を追加',
    body: '漫画や画像作品をアップロードし、スマホでも読みやすい展示へ並べます。',
  },
  {
    href: '/nfc/verify',
    eyebrow: 'NFC LAB',
    title: 'NFCタグ検証',
    body: 'NFC Toolsで書き込むURL、登録済み判定、未登録時の案内を確認します。',
  },
  {
    href: '/legal',
    eyebrow: 'SHOP DISCLOSURE',
    title: '開示情報を確認',
    body: '特定商取引法に基づく表記、プライバシーポリシー、利用規約を確認します。',
  },
]

function StatCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <article className="zmk-card p-5">
      <p className="zmk-eyebrow text-[11px]">{label}</p>
      <p className="mt-4 text-3xl font-bold text-[var(--zmk-ink-strong)]">{value}</p>
      <p className="zmk-muted mt-3 text-[13px] leading-7">{detail}</p>
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
    <main className="zmk-page">
      <BrandHeader />

      <PageHero
        eyebrow="HIDDEN ADMIN ROOM"
        title={
          <>
            管理機能を
            <span className="block">ここに集約する。</span>
          </>
        }
        lead="表のサイトには出さない、ざまくりプランツの作業室です。図鑑写真、音楽室、漫画部屋、NFC検証、開示情報をここから扱います。"
      />

      <section className="zmk-section">
        <div className="zmk-container">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <StatCard label="写真 未確認" value={pendingImages} detail="採用・除外が必要な図鑑候補画像。" />
            <StatCard label="写真 採用済み" value={assignments.length} detail="図鑑へ紐づけ済みの画像。" />
            <StatCard label="図鑑 品種" value={plants.length} detail="現在公開中の品種データ。" />
            <StatCard label="音楽室" value={musicTracks.length} detail="登録済みトラック数。" />
            <StatCard label="漫画部屋" value={museumWorks.length} detail="展示中の作品数。" />
          </div>

          {!getDictionaryImageAdminReady() && (
            <div className="zmk-card mt-6 border-[#b89558]/40 bg-[#fff9e8] p-5 text-[13px] leading-7 text-[#8a6a2f] dark:bg-[#b89558]/10 dark:text-[#f1dfb8]">
              図鑑画像管理の保存先が未設定です。Supabase Storage と管理用環境変数を確認してください。
            </div>
          )}

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {adminLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'zmk-card zmk-card-hover group block p-6',
                  item.primary ? 'bg-[#d9ffd8]/40 dark:bg-[#d9ffd8]/10' : '',
                ].join(' ')}
              >
                <p className="zmk-eyebrow text-[11px]">{item.eyebrow}</p>
                <h2 className="mt-5 text-2xl font-bold leading-tight text-[var(--zmk-ink-strong)] md:text-3xl">{item.title}</h2>
                <p className="zmk-muted mt-5 text-[15px] leading-8">{item.body}</p>
                <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-[#2c6a4b] transition group-hover:translate-x-1 dark:text-[#d9ffd8]">
                  OPEN
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

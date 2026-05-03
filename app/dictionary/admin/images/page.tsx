import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import { plants } from '@/lib/dictionary-data'
import { dictionaryImageCandidates } from '@/lib/dictionary-image-data'
import rejectedImages from '@/lib/dictionary-image-rejected.json'
import {
  getDictionaryImageAdminReady,
  listDictionaryImageAssignments,
  listDictionaryImageExclusions,
} from '@/lib/dictionary-image-storage'
import DictionaryImageAdmin from './DictionaryImageAdmin'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '図鑑代表画像 管理者入口 | ZAMAKURI.JP',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DictionaryImageAdminPage() {
  const assignments = await listDictionaryImageAssignments()
  const exclusions = await listDictionaryImageExclusions()
  const pendingCount = dictionaryImageCandidates.length - assignments.length - exclusions.length
  const primaryCount = assignments.filter((assignment) => assignment.role === 'primary').length

  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:var(--font-zamakuri)] dark:bg-[#07110c] dark:text-[#f7fbf1]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_18%,rgba(217,255,216,0.72),transparent_34%),linear-gradient(135deg,#fffef8_0%,#f7fbf1_52%,#d9ffd8_100%)] px-5 pb-16 pt-32 dark:bg-[radial-gradient(circle_at_80%_18%,rgba(217,255,216,0.18),transparent_34%),linear-gradient(135deg,#07110c_0%,#10291e_58%,#07110c_100%)] md:pb-24 md:pt-40">
        <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1fr)_420px] md:items-end">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              DICTIONARY IMAGE ADMIN
            </p>
            <h1 className="max-w-5xl text-[clamp(2.3rem,6vw,5.4rem)] font-bold leading-[1.08] tracking-normal text-[#143326] dark:text-[#f7fbf1]">
              図鑑代表画像を
              <span className="block">選んで整える。</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#315244]/82 dark:text-[#d9ffd8]/82 md:text-lg md:leading-9">
              PRIMARY が代表画像、GALLERY が追加画像です。代表画像は図鑑カードと品種詳細で優先表示されます。
            </p>
          </div>

          <div className="border border-[#2c6a4b]/10 bg-white/88 p-5 text-[13px] leading-7 text-[#315244]/76 shadow-[0_20px_70px_rgba(44,106,75,0.1)] dark:border-[#d9ffd8]/14 dark:bg-[#10291e]/86 dark:text-[#d9ffd8]/76">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">
              CURRENT QUEUE
            </p>
            <p className="mt-4">
              未確認 <span className="font-bold text-[#143326] dark:text-[#f7fbf1]">{Math.max(pendingCount, 0)}</span> 枚 /
              採用済み <span className="font-bold text-[#143326] dark:text-[#f7fbf1]"> {assignments.length}</span> 件 /
              代表画像 <span className="font-bold text-[#143326] dark:text-[#f7fbf1]"> {primaryCount}</span> 件 /
              除外 <span className="font-bold text-[#143326] dark:text-[#f7fbf1]"> {exclusions.length}</span> 枚
            </p>
            <p className="mt-3">
              抽出時の自動除外は <span className="font-bold text-[#143326] dark:text-[#f7fbf1]">{rejectedImages.length}</span> 枚。
              管理者が採用しない限り、図鑑には表示されません。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <DictionaryImageAdmin
          plants={plants}
          candidates={dictionaryImageCandidates}
          initialAssignments={assignments}
          initialExclusions={exclusions}
          adminReady={getDictionaryImageAdminReady()}
        />
        <div className="mt-10 flex flex-wrap justify-center gap-5 text-xs font-semibold tracking-[0.2em]">
          <Link href="/admin" className="text-[#315244]/62 transition hover:text-[#2c6a4b] dark:text-[#d9ffd8]/62 dark:hover:text-[#d9ffd8]">
            管理室へ戻る
          </Link>
          <Link href="/dictionary" className="text-[#315244]/62 transition hover:text-[#2c6a4b] dark:text-[#d9ffd8]/62 dark:hover:text-[#d9ffd8]">
            図鑑へ戻る
          </Link>
        </div>
      </section>
    </main>
  )
}

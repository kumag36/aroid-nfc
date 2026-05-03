import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
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
  title: '図鑑画像 管理者入口 | ZAMAKURI.JP',
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
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="DICTIONARY IMAGE ADMIN"
        title={
          <>
            図鑑代表画像を
            <span className="block">選んで整える。</span>
          </>
        }
        lead="PRIMARY が代表画像、GALLERY が追加画像です。代表画像は図鑑カードと品種詳細で優先表示されます。"
      />

      <section className="zmk-section">
        <div className="zmk-container">
          <div className="zmk-card mb-10 p-5 text-[13px] leading-7">
            <p className="zmk-eyebrow text-[11px]">CURRENT QUEUE</p>
            <p className="zmk-muted mt-4">
              未確認 <span className="font-bold text-[var(--zmk-ink-strong)]">{Math.max(pendingCount, 0)}</span> 枚 /
              採用済み <span className="font-bold text-[var(--zmk-ink-strong)]"> {assignments.length}</span> 件 /
              代表画像 <span className="font-bold text-[var(--zmk-ink-strong)]"> {primaryCount}</span> 件 /
              除外 <span className="font-bold text-[var(--zmk-ink-strong)]"> {exclusions.length}</span> 枚
            </p>
            <p className="zmk-muted mt-3">
              抽出時の自動除外は <span className="font-bold text-[var(--zmk-ink-strong)]">{rejectedImages.length}</span> 枚。
              管理者が採用しない限り、図鑑には表示されません。
            </p>
          </div>

          <DictionaryImageAdmin
            plants={plants}
            candidates={dictionaryImageCandidates}
            initialAssignments={assignments}
            initialExclusions={exclusions}
            adminReady={getDictionaryImageAdminReady()}
          />

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link href="/admin" className="zmk-button">
              管理室へ戻る
            </Link>
            <Link href="/dictionary" className="zmk-button">
              図鑑へ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

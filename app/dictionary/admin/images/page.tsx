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

  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:var(--font-zamakuri)]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_18%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,1fr)_420px] md:items-end">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              DICTIONARY IMAGE ADMIN
            </p>
            <h1 className="max-w-5xl text-[clamp(2.3rem,6vw,5.4rem)] font-medium leading-[1.08] tracking-normal">
              画像候補を
              <span className="block">確認して紐づける。</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#315244]/82 md:text-lg md:leading-9">
              自動判定は仮候補です。管理者が最終確認した画像だけを採用し、不要な画像は除外して作業キューを軽く保ちます。
            </p>
          </div>

          <div className="border border-[#2c6a4b]/10 bg-white/86 p-5 text-[13px] leading-7 text-[#315244]/70">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">
              CURRENT QUEUE
            </p>
            <p className="mt-4">
              未確認 <span className="text-[#eaffdf]">{Math.max(pendingCount, 0)}</span> 枚 /
              採用済み <span className="text-[#eaffdf]"> {assignments.length}</span> 件 /
              除外 <span className="text-[#eaffdf]"> {exclusions.length}</span> 枚
            </p>
            <p className="mt-3">
              抽出時の自動除外は <span className="text-[#eaffdf]">{rejectedImages.length}</span> 枚。
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
          <Link href="/admin" className="text-[#315244]/62 transition hover:text-[#d9ffd8]">
            管理室へ戻る
          </Link>
          <Link href="/dictionary" className="text-[#315244]/62 transition hover:text-[#d9ffd8]">
            図鑑へ戻る
          </Link>
        </div>
      </section>
    </main>
  )
}

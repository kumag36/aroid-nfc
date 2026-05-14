import Link from 'next/link'
import NfcIndividualsAdmin from './NfcIndividualsAdmin'
import { plants } from '@/lib/dictionary-data'
import { getNfcIndividualStorageReady, listNfcIndividuals } from '@/lib/nfc-individual-storage'
import { normalizeNfcId } from '@/lib/nfc-items'

type PageProps = {
  searchParams?: Promise<{ uid?: string }>
}

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'NFC個体タグ管理 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

export default async function AdminNfcIndividualsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const individuals = await listNfcIndividuals()
  const initialUid = normalizeNfcId(params?.uid ?? '')

  return (
    <main className="zmk-admin-page px-4 py-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="zmk-eyebrow text-[10px]">NFC INDIVIDUALS</p>
            <h1 className="mt-1 text-2xl font-bold">NFC個体タグ管理</h1>
            <p className="zmk-admin-muted mt-2 text-sm leading-6">販売株ごとのNFC UID、入荷・順化・販売・顧客復旧情報を管理します。</p>
          </div>
          <Link href="/admin/nfc" className="zmk-admin-link justify-center px-4 text-sm sm:w-auto">
            NFC管理へ戻る
          </Link>
        </div>
        <NfcIndividualsAdmin plants={plants} initialIndividuals={individuals} storageReady={getNfcIndividualStorageReady()} initialUid={initialUid} />
      </div>
    </main>
  )
}

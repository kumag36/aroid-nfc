import Link from 'next/link'
import { listAnalyticsSummary } from '@/lib/site-analytics'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'アクセス解析 | ZAMAKURI.JP',
  robots: { index: false, follow: false },
}

function StatCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="zmk-admin-card p-4">
      <p className="zmk-eyebrow text-[10px]">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      {note ? <p className="zmk-admin-muted mt-2 text-xs leading-5">{note}</p> : null}
    </div>
  )
}

function RankingTable({ title, rows }: { title: string; rows: Array<{ label: string; count: number }> }) {
  return (
    <section className="zmk-admin-card overflow-hidden">
      <div className="border-b border-[var(--zmk-border)] p-4">
        <p className="zmk-eyebrow text-[10px]">{title}</p>
      </div>
      {rows.length ? (
        <div className="divide-y divide-[var(--zmk-border)]">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_4rem] gap-3 px-4 py-3 text-sm">
              <span className="break-words font-bold">{row.label}</span>
              <span className="text-right font-black">{row.count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="zmk-admin-muted p-4 text-sm">まだデータがありません。</p>
      )}
    </section>
  )
}

export default async function AdminAnalyticsPage() {
  const summary = await listAnalyticsSummary(30)

  return (
    <main className="zmk-admin-page px-4 py-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="zmk-eyebrow text-[10px]">WEB ANALYTICS</p>
            <h1 className="mt-1 text-2xl font-bold">アクセス解析</h1>
            <p className="zmk-admin-muted mt-2 text-sm leading-6">全ページ共通カウンターの直近30日集計です。</p>
          </div>
          <Link href="/admin" className="zmk-admin-link justify-center px-4 text-sm sm:w-auto">
            管理へ戻る
          </Link>
        </div>

        {summary.message ? (
          <section className="zmk-admin-alert mb-5 p-4">
            <p className="zmk-eyebrow text-[10px]">STORAGE</p>
            <p className="mt-2 text-sm font-bold leading-6">
              {summary.storage === 'bucket' ? 'テーブル未作成のため、Storage退避データから集計しています。' : summary.message}
            </p>
          </section>
        ) : null}

        <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="TOTAL PV" value={summary.total} note={`直近${summary.days}日`} />
          <StatCard label="STORAGE" value={summary.storage.toUpperCase()} note={summary.storage === 'table' ? '集計テーブル使用中' : 'フォールバック使用中'} />
          <StatCard label="PAGES" value={summary.pageRows.length} note="PVがあったページ数" />
          <StatCard label="TODAY" value={summary.dayRows.find((row) => row.label === new Date().toISOString().slice(0, 10))?.count ?? 0} note="本日PV" />
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <RankingTable title="ページ別集計" rows={summary.pageRows} />
          <RankingTable title="日別集計" rows={summary.dayRows} />
          <RankingTable title="流入元集計" rows={summary.sourceRows} />
          <RankingTable title="使用端末集計" rows={summary.deviceRows} />
        </div>

        <section className="zmk-admin-card mt-5 overflow-hidden">
          <div className="border-b border-[var(--zmk-border)] p-4">
            <p className="zmk-eyebrow text-[10px]">LATEST PV</p>
          </div>
          {summary.latestRows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-[var(--zmk-border)] text-xs">
                  <tr>
                    <th className="px-4 py-3">日時</th>
                    <th className="px-4 py-3">ページ</th>
                    <th className="px-4 py-3">流入元</th>
                    <th className="px-4 py-3">端末</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--zmk-border)]">
                  {summary.latestRows.map((row, index) => (
                    <tr key={`${row.createdAt}-${row.path}-${index}`}>
                      <td className="px-4 py-3 font-bold">{new Date(row.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</td>
                      <td className="px-4 py-3 font-bold">{row.path}</td>
                      <td className="px-4 py-3">{row.source}</td>
                      <td className="px-4 py-3">{row.deviceType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="zmk-admin-muted p-4 text-sm">まだデータがありません。</p>
          )}
        </section>
      </div>
    </main>
  )
}

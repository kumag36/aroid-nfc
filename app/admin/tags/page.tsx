import Link from 'next/link'
import { getDictionaryTagStats, type DictionaryTagRow } from '@/lib/dictionary-tags'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'タグ管理 | ZAMAKURI.JP',
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

function StatusBadge({ row }: { row: DictionaryTagRow }) {
  const label = row.registered ? (row.status === 'active' ? '運用中' : row.status === 'deprecated' ? '廃止予定' : '要確認') : '未登録'
  return <span className="rounded-full border border-[var(--zmk-border)] bg-[var(--zmk-bg-soft)] px-2 py-1 text-[11px] font-black">{label}</span>
}

function TagList({ title, rows, emptyText }: { title: string; rows: DictionaryTagRow[]; emptyText: string }) {
  return (
    <section className="zmk-admin-card overflow-hidden">
      <div className="border-b border-[var(--zmk-border)] p-4">
        <p className="zmk-eyebrow text-[10px]">{title}</p>
      </div>
      {rows.length ? (
        <div className="divide-y divide-[var(--zmk-border)]">
          {rows.map((row) => (
            <article key={row.name} className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black">{row.name}</h2>
                <StatusBadge row={row} />
                <span className="rounded-full border border-[var(--zmk-border)] px-2 py-1 text-[11px] font-bold">{row.group}</span>
                <span className="zmk-admin-muted text-xs font-bold">{row.count}件</span>
              </div>
              <p className="zmk-admin-muted mt-2 text-sm leading-6">{row.description}</p>
              <div className="mt-3 grid gap-3 text-xs leading-5 sm:grid-cols-3">
                <div>
                  <p className="font-black">カテゴリ</p>
                  <p className="zmk-admin-muted mt-1">{row.categories.join(' / ')}</p>
                </div>
                <div>
                  <p className="font-black">代表株</p>
                  <p className="zmk-admin-muted mt-1">{row.plants.slice(0, 3).map((plant) => plant.displayName).join(' / ')}</p>
                </div>
                <div>
                  <p className="font-black">別名・統合先</p>
                  <p className="zmk-admin-muted mt-1">
                    {[...row.aliases, row.mergeTo ? `統合先: ${row.mergeTo}` : ''].filter(Boolean).join(' / ') || 'なし'}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="zmk-admin-muted p-4 text-sm">{emptyText}</p>
      )}
    </section>
  )
}

export default function AdminTagsPage() {
  const stats = getDictionaryTagStats()

  return (
    <main className="zmk-admin-page px-4 py-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="zmk-eyebrow text-[10px]">DICTIONARY TAGS</p>
            <h1 className="mt-1 text-2xl font-bold">タグ管理</h1>
            <p className="zmk-admin-muted mt-2 text-sm leading-6">図鑑カードのタグ使用状況、表記ゆれ、未登録タグを確認します。</p>
          </div>
          <Link href="/admin" className="zmk-admin-link justify-center px-4 text-sm sm:w-auto">
            管理へ戻る
          </Link>
        </div>

        <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="TAGS" value={stats.totalTags} note="使用中のユニークタグ" />
          <StatCard label="ASSIGNMENTS" value={stats.totalAssignments} note="カードへのタグ付与数" />
          <StatCard label="REGISTERED" value={stats.registeredCount} note="台帳登録済みタグ" />
          <StatCard label="REVIEW" value={stats.unregisteredCount + stats.reviewRows.length} note="未登録または要確認" />
        </section>

        <section className="zmk-admin-alert mb-5 p-4">
          <p className="zmk-eyebrow text-[10px]">RULE</p>
          <p className="mt-2 text-sm font-bold leading-6">
            タグは短い正規名で統一します。似た意味の語は別名または統合先として台帳に残し、公開カードでは正規名だけを使います。
          </p>
        </section>

        <div className="mb-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <TagList title="使用中タグ一覧" rows={stats.tagRows} emptyText="使用中タグはありません。" />

          <aside className="space-y-5">
            <section className="zmk-admin-card overflow-hidden">
              <div className="border-b border-[var(--zmk-border)] p-4">
                <p className="zmk-eyebrow text-[10px]">GROUPS</p>
              </div>
              <div className="divide-y divide-[var(--zmk-border)]">
                {stats.groupRows.map((row) => (
                  <div key={row.group} className="grid grid-cols-[minmax(0,1fr)_4rem] gap-3 px-4 py-3 text-sm">
                    <span className="font-bold">{row.group}</span>
                    <span className="text-right font-black">{row.assignmentCount}</span>
                  </div>
                ))}
              </div>
            </section>

            <TagList title="未登録タグ" rows={stats.unregisteredRows} emptyText="未登録タグはありません。" />
            <TagList title="要確認タグ" rows={stats.reviewRows} emptyText="要確認タグはありません。" />
          </aside>
        </div>

        <section className="zmk-admin-card p-4">
          <p className="zmk-eyebrow text-[10px]">NEXT</p>
          <h2 className="mt-1 text-xl font-black">運用メモ</h2>
          <p className="zmk-admin-muted mt-2 text-sm leading-6">
            追加・変更は現在コード管理です。次の段階でSupabaseなどの永続DBへ移し、管理画面から編集・統合・非表示化できるようにします。
          </p>
        </section>
      </div>
    </main>
  )
}

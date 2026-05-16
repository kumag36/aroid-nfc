import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import PreorderForm from './PreorderForm'

export const metadata = {
  title: '予約オーダー | ZAMAKURI.JP',
  description: 'ざまくりプランツの予約オーダーフォームです。探している植物、予算、受取方法を送信できます。',
  robots: { index: false, follow: false },
}

export default function PreorderPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="PREORDER"
        title="予約オーダー"
        lead="探している植物、予算、受取方法を先に共有できます。内容を確認して、在庫や入荷予定に合わせて折り返します。"
      />
      <section className="zmk-section pt-0">
        <div className="zmk-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <PreorderForm />
          <aside className="grid gap-4">
            <div className="border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/82 p-5">
              <p className="zmk-eyebrow mb-3">NOTE</p>
              <p className="text-sm font-bold leading-7 text-[var(--zmk-ink-soft)]">
                予約は購入確定ではありません。状態、サイズ、価格、受取方法を確認してから正式に進めます。
              </p>
            </div>
            <div className="border border-[var(--zmk-border)] bg-[var(--zmk-bg-card)]/82 p-5">
              <p className="zmk-eyebrow mb-3">CONTACT</p>
              <p className="text-sm font-bold leading-7 text-[var(--zmk-ink-soft)]">
                急ぎの場合はInstagram DMまたはメールでも連絡できます。
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

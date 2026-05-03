import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

export const metadata = {
  title: '店主より | ZAMAKURI.JP',
  description:
    '2025年6月の開業から走り続けた11か月を振り返る、ざまくりプランツ店主からのご挨拶。',
}

const message = [
  '2025年6月の開業から走り続けた11か月。',
  'この情熱を持って、行動し、さまざまな人と出会い、結果、何を失い何を残せたのか。',
  '今一度、我が身を振り返り歩んで参ります。',
  'いまだ若輩故、不知、不手際、不心得により、親愛なる皆様にご迷惑をお掛けする事、大きな懐でご容赦いただき、なにとぞ引き続き、ご指導ご鞭撻、ご愛顧のほど、心より宜しくお願い申し上げます。',
]

export default function OwnerMessagePage() {
  return (
    <main className="zmk-page">
      <BrandHeader />

      <PageHero
        eyebrow="店主より"
        title={
          <>
            ざまくりプランツ
            <span className="block">店主からの言葉</span>
          </>
        }
        lead="開業から約一年。植物と人に向き合ってきた時間を、静かに振り返ります。"
        actions={
          <>
            <Link href="/history" className="zmk-button zmk-button-primary">
              歩みを見る
            </Link>
            <Link href="/dictionary" className="zmk-button">
              図鑑を見る
            </Link>
          </>
        }
      />

      <section className="zmk-section">
        <div className="zmk-container max-w-4xl">
          <article className="zmk-card px-6 py-9 sm:px-10 sm:py-12 md:px-14">
            <p className="zmk-eyebrow">MESSAGE / MAY 2026</p>
            <h2 className="mt-6 text-[var(--zmk-ink-strong)]">店主からのメッセージ</h2>

            <div className="mt-8 space-y-6 text-[1rem] font-semibold leading-[2.05] text-[var(--zmk-ink)] sm:text-[1.08rem]">
              {message.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 border-t border-[var(--zmk-border)] pt-8 text-right">
              <p className="zmk-muted text-sm leading-7">2026年5月吉日</p>
              <p className="mt-3 text-lg font-bold tracking-[0.08em] text-[var(--zmk-ink-strong)]">
                ざまくりプランツ店主
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--zmk-ink-strong)]">ざまくり</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

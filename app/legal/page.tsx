import Link from 'next/link'
import LegalShell from './LegalShell'

export const metadata = {
  title: 'ショップ情報 | ZAMAKURI.JP',
  description: 'ざまくりプランツの取引条件、個人情報保護、利用規約への案内ページ。',
}

const pages = [
  {
    href: '/legal/commerce',
    title: '特定商取引法に基づく表記',
    text: '販売者、連絡先、販売価格、送料、返品・キャンセルなど通信販売に必要な表示を整理します。',
  },
  {
    href: '/legal/privacy',
    title: 'プライバシーポリシー',
    text: 'お問い合わせ、購入、NFC個体管理で取り扱う個人情報の利用目的と管理方針を示します。',
  },
  {
    href: '/legal/terms',
    title: '利用規約・販売条件',
    text: 'WEBサイト、図鑑、NFC個体管理、販売ページを利用する際の共通ルールをまとめます。',
  },
]

export default function LegalIndexPage() {
  return (
    <LegalShell
      eyebrow="SHOP DISCLOSURE"
      title="安心して取引するための開示情報"
      lead="WEBショップ化に向けて、販売条件・個人情報・利用条件を一箇所にまとめました。"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {pages.map((page) => (
          <Link key={page.href} href={page.href} className="zmk-card zmk-card-hover block p-6">
            <p className="zmk-eyebrow mb-5 text-[10px]">LEGAL</p>
            <h2 className="text-2xl">{page.title}</h2>
            <p className="zmk-muted mt-5 text-sm leading-7">{page.text}</p>
          </Link>
        ))}
      </div>
    </LegalShell>
  )
}

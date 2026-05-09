import LegalShell from './LegalShell'

export const metadata = {
  title: '特定商取引法に基づく表記 | ZAMAKURI.JP',
  description: 'ざまくりプランツの特定商取引法に基づく表記です。',
}

const rows = [
  ['事業者名', 'ざまくりプランツ'],
  ['販売責任者', '熊谷寿晃'],
  ['所在地', '神奈川県座間市栗原中央3-16-13'],
  ['電話番号', '070-1511-3690'],
  ['メールアドレス', 'kumajuko@gmail.com'],
  ['支払い方法', '銀行振込 / クレジットカード / PayPal'],
  ['対面時のみ', '現金 / 交通系IC / 各種QR決済'],
  ['返品条件', '返品・キャンセルについては、商品の性質上、原則としてお客様都合による返品はお受けしておりません。ただし、到着時の明らかな破損・状態不良・品種違い等が確認された場合は、双方合意の上で対応いたします。商品到着後、速やかに写真を添えてご連絡ください。'],
]

export default function LegalPage() {
  return (
    <LegalShell eyebrow="LEGAL NOTICE" title="特定商取引法に基づく表記" lead="購入前の不安を減らすため、取引に必要な情報を読みやすく整理しています。">
      <div className="overflow-hidden border border-[var(--zmk-border)] bg-[var(--zmk-card)]">
        <dl>
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-2 border-b border-[var(--zmk-border)] p-4 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-7 sm:p-5">
              <dt className="zmk-eyebrow text-[11px]">{label}</dt>
              <dd className="text-[15px] font-bold leading-8 text-[var(--zmk-ink-strong)]">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </LegalShell>
  )
}

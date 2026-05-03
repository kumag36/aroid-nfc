import LegalShell from '../LegalShell'

export const metadata = {
  title: '特定商取引法に基づく表記 | ZAMAKURI.JP',
  description: 'ざまくりプランツの特定商取引法に基づく表記。',
}

const rows = [
  ['販売業者', 'ざまくりプランツ'],
  ['運営責任者', 'ざまくりプランツ運営者'],
  ['所在地', '請求があった場合、遅滞なく開示します。'],
  ['電話番号', '請求があった場合、遅滞なく開示します。営業・迷惑連絡対策のため、通常のお問い合わせはInstagram DMまたはメールをご利用ください。'],
  ['メールアドレス', 'kumajuko@gmail.com'],
  ['販売価格', '各商品ページに税込価格で表示します。'],
  ['商品代金以外の必要料金', '送料、振込手数料、決済手数料が発生する場合があります。詳細は各商品ページまたは注文確定前の画面に表示します。'],
  ['支払方法', '銀行振込、オンライン決済、その他当サイトが指定する方法。'],
  ['支払時期', '注文確定後、当サイトが案内する期限までにお支払いください。'],
  ['商品の引渡時期', '入金確認後、植物の状態と天候を確認し、通常3〜7営業日を目安に発送します。イベント受け渡しの場合は個別に案内します。'],
  ['返品・交換・キャンセル', '植物という商品の性質上、お客様都合による返品・交換は原則お受けできません。到着時の著しい傷み、誤発送がある場合は、到着当日中に写真を添えてご連絡ください。'],
  ['販売数量', '各商品ページに表示します。希少株は一点物のため、売り切れの場合があります。'],
  ['お問い合わせ', 'Instagram DM または kumajuko@gmail.com までご連絡ください。'],
]

export default function CommercePage() {
  return (
    <LegalShell
      eyebrow="SPECIFIED COMMERCIAL TRANSACTIONS ACT"
      title="特定商取引法に基づく表記"
      lead="植物を安心して迎えていただくため、通信販売に必要な表示事項を整理しています。"
    >
      <div className="zmk-card p-6 md:p-8">
        <table className="zmk-table">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td className="zmk-muted">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="zmk-muted mt-6 text-xs leading-6">
        所在地・電話番号は、特定商取引法上の表示省略が認められる範囲では省略し、請求があった場合に遅滞なく開示します。
      </p>
    </LegalShell>
  )
}

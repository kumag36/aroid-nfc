import LegalShell from '../LegalShell'

export const metadata = {
  title: '利用規約・販売条件 | ZAMAKURI.JP',
  description: 'ざまくりプランツのサイト利用規約と販売条件。',
}

const terms = [
  {
    title: 'サイト利用',
    text: '当サイトの図鑑、NFC個体管理、漫画部屋、音楽室、販売ページは、ざまくりプランツの活動を記録し、利用者に情報を提供するために運営しています。',
  },
  {
    title: '植物の状態',
    text: '植物は生き物のため、撮影時から葉姿、斑、根、傷、成長状態が変化する場合があります。購入前に最新状態の確認をおすすめします。',
  },
  {
    title: '注文とキャンセル',
    text: '注文確定後のキャンセルは原則としてお受けできません。やむを得ない事情がある場合は、発送前に速やかにご連絡ください。',
  },
  {
    title: '配送リスク',
    text: '天候、気温、配送状況により植物に負担がかかる場合があります。必要に応じて発送日を調整します。',
  },
  {
    title: 'NFC個体管理',
    text: 'NFCタグに登録された情報は、個体の履歴管理と確認のために利用します。タグの紛失、破損、第三者による読み取りにはご注意ください。',
  },
  {
    title: '禁止事項',
    text: '不正アクセス、虚偽情報の送信、画像・文章・音源・漫画の無断転載、当サイト運営を妨げる行為を禁止します。',
  },
  {
    title: '内容変更',
    text: '当サイトは、必要に応じて掲載内容、販売条件、規約を変更することがあります。変更後は当サイト上に表示した時点から適用されます。',
  },
]

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="TERMS AND SALES POLICY"
      title="利用規約・販売条件"
      lead="植物を気持ちよく迎えていただくため、サイト利用と販売に関する基本条件をまとめています。"
    >
      <div className="grid gap-4">
        {terms.map((term, index) => (
          <section key={term.title} className="zmk-card grid gap-5 p-6 md:grid-cols-[80px_1fr]">
            <p className="text-3xl font-bold text-[var(--zmk-gold)]">{String(index + 1).padStart(2, '0')}</p>
            <div>
              <h2 className="text-2xl">{term.title}</h2>
              <p className="zmk-muted mt-4 text-[15px] leading-8">{term.text}</p>
            </div>
          </section>
        ))}
      </div>
    </LegalShell>
  )
}

import LegalShell from '../LegalShell'

export const metadata = {
  title: 'プライバシーポリシー | ZAMAKURI.JP',
  description: 'ざまくりプランツの個人情報保護方針。',
}

const sections = [
  {
    title: '取得する情報',
    text: '氏名、住所、電話番号、メールアドレス、SNSアカウント、購入・問い合わせ内容、NFC個体管理に必要な個体情報、アクセス解析に関する情報を取得する場合があります。',
  },
  {
    title: '利用目的',
    text: '商品の販売・発送、問い合わせ対応、NFC個体管理、図鑑・品種情報の改善、不正利用防止、サービス品質向上のために利用します。',
  },
  {
    title: '第三者提供',
    text: '法令に基づく場合、配送・決済など業務委託に必要な場合を除き、本人の同意なく第三者に提供しません。',
  },
  {
    title: '安全管理',
    text: '取得した情報は、紛失、漏えい、改ざん、不正アクセスを防ぐため、必要かつ適切な範囲で管理します。',
  },
  {
    title: '開示・訂正・削除',
    text: '本人から個人情報の開示、訂正、削除、利用停止の請求があった場合、法令に従い適切に対応します。',
  },
  {
    title: 'お問い合わせ',
    text: 'プライバシーに関するお問い合わせは、Instagram DM または kumajuko@gmail.com までご連絡ください。',
  },
]

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="PRIVACY POLICY"
      title="プライバシーポリシー"
      lead="ざまくりプランツは、植物の販売・個体管理・お問い合わせで扱う情報を、必要な範囲で大切に管理します。"
    >
      <div className="grid gap-4">
        {sections.map((section) => (
          <section key={section.title} className="zmk-card p-6">
            <h2 className="text-2xl">{section.title}</h2>
            <p className="zmk-muted mt-4 text-[15px] leading-8">{section.text}</p>
          </section>
        ))}
      </div>
    </LegalShell>
  )
}

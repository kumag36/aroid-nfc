import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

const instagramProfileUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL ??
  'https://www.instagram.com/zamakuri_plants/'

const registrationSteps = [
  ['01', 'NFC IDを控える', 'タグに表示されたZMKから始まるID、または読み取ったURLをそのまま共有してください。'],
  ['02', '品種と個体情報を送る', '品種名、流通名、購入日、管理メモ、写真の有無を分かる範囲で送ってください。'],
  ['03', '管理局で登録する', '内容を確認し、個体ページと図鑑ページをつなぎます。登録後はNFCから個体履歴へ進めます。'],
]

export const metadata = {
  title: 'NFC個体登録申請 | ZAMAKURI.JP',
  description: 'ざまくりプランツのNFC個体管理DBへ登録申請するための案内ページ。',
}

type RegisterPageProps = {
  searchParams?: Promise<{ uid?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = searchParams ? await searchParams : {}
  const uid = typeof params.uid === 'string' ? params.uid : ''
  const mailSubject = encodeURIComponent('植物ID登録依頼')
  const mailBody = encodeURIComponent([
    uid ? `植物ID：${uid}` : '植物ID：',
    '品種名：',
    '和名 / 流通名：',
    '購入日 / 入手日：',
    '管理メモ：',
    '写真：あり / なし',
  ].join('\n'))

  return (
    <main className="zmk-page">
      <BrandHeader />

      <PageHero
        eyebrow="NFC REGISTRATION REQUEST"
        title={
          <>
            NFC個体管理DBへ
            <span className="block">登録申請する。</span>
          </>
        }
        lead="NFCタグは、品種名だけでは見えない一株ごとの履歴を残す入口です。未登録IDは、管理局で確認してから個体ページへ反映します。"
        actions={
          <aside className="zmk-card p-5 backdrop-blur">
            <p className="zmk-eyebrow mb-4 text-[11px]">SEND TO</p>
            <div className="grid gap-3">
              <Link href={instagramProfileUrl} target="_blank" rel="noreferrer" className="zmk-button zmk-button-primary">
                Instagram DMで送る
              </Link>
              <Link href={`mailto:kumajuko@gmail.com?subject=${mailSubject}&body=${mailBody}`} className="zmk-button">
                Gmailで送る
              </Link>
            </div>
            <p className="zmk-muted mt-5 text-xs leading-6">
              {uid ? `植物ID ${uid} を申請本文に入れています。` : '迷ったらURLをそのまま送ってください。こちらでIDを確認します。'}
            </p>
          </aside>
        }
      />

      <section className="zmk-section">
        <div className="zmk-container grid gap-4 md:grid-cols-3">
          {registrationSteps.map(([number, title, text]) => (
            <article key={number} className="zmk-card p-6">
              <p className="zmk-eyebrow mb-5 text-xs">{number}</p>
              <h2 className="text-2xl">{title}</h2>
              <p className="zmk-muted mt-5 text-[15px] leading-8">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="zmk-section zmk-section-soft">
        <div className="zmk-container">
          <p className="zmk-eyebrow mb-5">REGISTRATION GUIDE</p>
          <h2 className="max-w-4xl">登録されると、NFCから個体履歴へつながります。</h2>
          <div className="zmk-muted mt-8 grid gap-4 text-[15px] leading-8 md:grid-cols-2">
            <p>
              個体ページには、品種名、流通名、図鑑リンク、管理メモ、入手日などを順次記録します。販売時だけでなく、育成中の確認にも使えるDBを目指します。
            </p>
            <p>
              現段階では管理局確認後の登録制です。スパム対策のため、電話番号や連絡先の公開HTMLへの直接露出を控えています。
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

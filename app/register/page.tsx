import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'

const instagramProfileUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_PROFILE_URL ??
  'https://www.instagram.com/zamakuri_plants/'

const registrationSteps = [
  ['01', 'NFC IDを控える', 'タグに表示された ZMK から始まるID、または読み取ったURLをそのまま共有してください。'],
  ['02', '品種と個体情報を送る', '品種名、流通名、購入日、管理メモ、写真の有無を分かる範囲で送ってください。'],
  ['03', '管理局で登録する', '内容を確認し、個体ページと図鑑ページをつなげます。登録後はNFCから個体履歴へ進めます。'],
]

export const metadata = {
  title: 'NFC個体登録申請 | ざまくりプランツ',
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
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_20%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 py-8 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 py-16 md:grid-cols-[minmax(0,1fr)_380px] md:items-end md:py-24">
          <div>
            <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
              NFC REGISTRATION REQUEST
            </p>
            <h1 className="max-w-5xl text-[clamp(2.4rem,6vw,5.8rem)] font-medium leading-[1.08]">
              NFC個体管理DBへ
              <span className="block">登録申請する。</span>
            </h1>
            <p className="mt-8 max-w-3xl text-[15px] leading-8 text-[#315244]/80 md:text-lg md:leading-9">
              ざまくりプランツのNFCタグは、品種名だけでは見えない一株ごとの履歴を残すための入口です。未登録IDは、管理局で確認してから個体ページへ反映します。
            </p>
          </div>

          <aside className="border border-[#2c6a4b]/12 bg-[#fffaf0]/6 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
            <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-[#b89558]">SEND TO</p>
            <div className="grid gap-3">
              <Link href={instagramProfileUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]">
                Instagram DMで送る
              </Link>
              <Link href={`mailto:kumajuko@gmail.com?subject=${mailSubject}&body=${mailBody}`} className="inline-flex min-h-12 items-center justify-center border border-[#2c6a4b]/22 px-6 text-sm font-semibold tracking-[0.16em] text-[#143326] transition duration-300 hover:-translate-y-0.5 hover:border-[#2c6a4b]/55">
                Gmailで送る
              </Link>
            </div>
            <p className="mt-5 text-xs leading-6 text-[#315244]/60">
              {uid ? `植物ID ${uid} を申請本文に入れています。` : '迷ったらURLをそのまま送ってください。こちらでIDを確認します。'}
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-16 md:grid-cols-3 md:py-24">
        {registrationSteps.map(([number, title, text]) => (
          <article key={number} className="border border-[#2c6a4b]/10 bg-white/86 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <p className="mb-5 text-xs font-semibold tracking-[0.22em] text-[#b89558]">{number}</p>
            <h2 className="text-2xl font-medium leading-tight">{title}</h2>
            <p className="mt-5 text-[15px] leading-8 text-[#315244]/76">{text}</p>
          </article>
        ))}
      </section>

      <section className="border-y border-[#2c6a4b]/10 bg-[#0b1710] px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">REGISTRATION GUIDE</p>
          <h2 className="max-w-4xl text-[clamp(2rem,4vw,3.6rem)] font-medium leading-tight">
            登録されると、NFCから個体履歴へつながります。
          </h2>
          <div className="mt-8 grid gap-4 text-[15px] leading-8 text-[#315244]/78 md:grid-cols-2">
            <p>
              個体ページには、品種名、流通名、図鑑リンク、管理メモ、入手日などを順次記録していきます。販売時だけでなく、育成中の確認にも使えるDBを目指します。
            </p>
            <p>
              現段階では管理局確認後の登録制です。スパム対策のため、電話番号や連絡先はページ上で段階的に表示し、公開HTMLへの直接露出を抑えています。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbf1] px-5 py-16 text-[#191a15] md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] leading-8 text-[#665f55]">
            図鑑は育てながら深くなる。NFC管理DBは、その一株の時間を残すための台帳です。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dictionary" className="inline-flex min-h-11 min-w-40 items-center justify-center border border-[#191a15] bg-[#191a15] px-5 text-xs font-semibold tracking-[0.18em] text-[#143326]">
              図鑑へ戻る
            </Link>
            <Link href="/" className="inline-flex min-h-11 min-w-40 items-center justify-center border border-[#191a15]/18 px-5 text-xs font-semibold tracking-[0.18em] text-[#191a15]">
              トップへ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}











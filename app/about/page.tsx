import Image from 'next/image'
import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

export const metadata = {
  title: 'ショップ情報 | ZAMAKURI.JP',
  description: 'ざまくりプランツの基本情報、店主の思い、活動内容をまとめたショップ情報ページです。',
}

const shopFacts = [
  ['ショップ名', 'ざまくりプランツ'],
  ['代表者', '熊谷寿晃'],
  ['所在地', '神奈川県座間市栗原中央'],
  ['メール', 'kumajuko@gmail.com'],
  ['扱う植物', 'モンステラ、アロイド、ビカクシダ、斑入り植物全般'],
]

const audiences = [
  'モンステラが好きな人',
  'アロイドが好きな人',
  'ビカクシダが好きな人',
  '園芸初心者',
  '緑に囲まれたい人',
  '植物のある暮らしに憧れている人',
  '新たな刺激を求めている人',
]

const storyParagraphs = [
  'キレイな植物をみんなに見てもらいたかった。素敵な植物との出会いをつくりたかった。とにかく植物に囲まれる生活にあこがれた。',
  '最初の動機はそんなもんです。',
  'けれど、そのうち、初心者でどう育てれば良いかわからない人。買ってきた植物を毎回枯らしてしまう人。植物への苦手意識を無くしたい人。そんな人たちの助けになりたいと思うようになりました。',
  '植物が愛おしくてたまらない人。植物に囲まれて暮らしたい人。正しい知識を手に入れたい人。そんな人たちと知識を共有したい。',
  '品種や金額で不安な思いをした人。状態の悪い株が届いて困った人。販売者と連絡が取れず不安になった人。そんな人を少しでも減らしたい。',
  'ざまくりプランツは、植物との出会いをもっと安心で、もっと楽しいものにするための小さな植物店です。',
]

const activities = [
  '各種イベント出店',
  '海外仕入れ',
  'タイの有名ナーセリーや現地専属バイヤーとの独自ルート',
  'モンステラ、アロイド、ビカクシダ、斑入り植物の取り扱い',
]

const photoSlots = [
  { label: '店主写真', image: '/brand/zamakuri-shop-logo.webp' },
  { label: '作業風景', image: '/history/opening.jpg' },
  { label: '実際の株', image: '/history/plants.jpg' },
  { label: 'イベント出店風景', image: '/history/event.jpg' },
]

function InfoTable() {
  return (
    <dl className="grid gap-0 overflow-hidden border border-[var(--zmk-border)] bg-[var(--zmk-card)]">
      {shopFacts.map(([label, value]) => (
        <div key={label} className="grid gap-2 border-b border-[var(--zmk-border)] p-4 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-6">
          <dt className="zmk-eyebrow text-[11px] text-[#b89558]">{label}</dt>
          <dd className="text-[15px] font-bold leading-7 text-[var(--zmk-ink-strong)]">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function AboutPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="SHOP INFORMATION"
        title="ショップ情報"
        lead="小さな植物店だからこそ、扱う株も、伝える言葉も、顔の見える距離感で整えていきます。"
        actions={
          <>
            <Link href="/dictionary" className="zmk-button zmk-button-primary">図鑑を見る</Link>
            <a href="mailto:kumajuko@gmail.com" className="zmk-button text-[#fffef8]">お問い合わせ</a>
          </>
        }
      />
      <section className="zmk-section">
        <div className="zmk-container grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_420px] lg:items-start">
          <div>
            <p className="zmk-eyebrow mb-5">ABOUT ZAMAKURI PLANTS</p>
            <h2>実在する人が、植物と向き合う場所。</h2>
            <div className="mt-8 space-y-6 text-[16px] leading-9 text-[var(--zmk-ink)]">
              {storyParagraphs.map((text) => <p key={text}>{text}</p>)}
            </div>
          </div>
          <InfoTable />
        </div>
      </section>
      <section className="zmk-section zmk-section-soft">
        <div className="zmk-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="zmk-eyebrow mb-5">FOR YOU</p>
            <h2>届けたい人</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {audiences.map((item) => <span key={item} className="zmk-pill">{item}</span>)}
            </div>
          </div>
          <div>
            <p className="zmk-eyebrow mb-5">ACTIVITY</p>
            <h2>活動実績</h2>
            <ul className="mt-8 grid gap-3 text-[15px] leading-8 text-[var(--zmk-ink)]">
              {activities.map((item) => <li key={item} className="border-l border-[#b89558]/55 bg-[var(--zmk-card)] px-5 py-3">{item}</li>)}
            </ul>
            <p className="zmk-muted mt-5 text-sm leading-7">イベント出店回数は、現時点で正確な数値が確定していないため推測せず「各種イベント出店」と表記しています。</p>
          </div>
        </div>
      </section>
      <section className="zmk-section">
        <div className="zmk-container">
          <div className="zmk-split-head mb-10">
            <div>
              <p className="zmk-eyebrow mb-5">PHOTO RECORD</p>
              <h2>顔が見える記録</h2>
            </div>
            <p className="zmk-muted text-[15px] leading-8">未設定の写真は、差し替えやすい枠として残します。店主、作業、株、イベントの実在感をここに蓄積します。</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {photoSlots.map((slot) => (
              <figure key={slot.label} className="zmk-card overflow-hidden">
                <div className="relative aspect-[4/5] bg-[#10291e]">
                  <Image src={slot.image} alt={slot.label} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,7,0.04),rgba(5,10,7,0.34))]" />
                </div>
                <figcaption className="p-4 text-sm font-bold text-[var(--zmk-ink-strong)]">{slot.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
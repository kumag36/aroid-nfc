import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'
import NfcVerifyConsole from './NfcVerifyConsole'

export const metadata = {
  title: 'NFC検証室 | ZAMAKURI.JP',
  description:
    'ざまくりプランツのNFCタグに書き込むURLと、個体管理DBの接続状態を確認する検証ページ。',
}

export default function NfcVerifyPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />

      <PageHero
        eyebrow="NFC VERIFICATION ROOM"
        title={
          <>
            NFCタグとDBを
            <span className="block">静かに検証する。</span>
          </>
        }
        lead="iPhone運用では、NFC Toolsで短いURLをタグへ書き込みます。書き込み予定URL、未登録時の案内、図鑑・音楽室・漫画部屋DBの状態をまとめて確認できます。"
      />

      <section className="zmk-section">
        <div className="zmk-container">
          <NfcVerifyConsole />
        </div>
      </section>
    </main>
  )
}

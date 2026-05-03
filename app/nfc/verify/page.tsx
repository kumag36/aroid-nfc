import BrandHeader from '@/app/components/BrandHeader'
import NfcVerifyConsole from './NfcVerifyConsole'

export const metadata = {
  title: 'NFC検証室 | ZAMAKURI.JP',
  description:
    'ざまくりプランツのNFCタグに書き込むURLと、個体管理DBの接続状態を確認する検証ページ。',
}

export default function NfcVerifyPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf1] text-[#143326] [font-family:var(--font-zamakuri)]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_18%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            NFC VERIFICATION ROOM
          </p>
          <h1 className="max-w-5xl text-[clamp(2.55rem,7vw,6.2rem)] font-medium leading-[1.08] tracking-normal">
            NFCタグとDBを
            <span className="block">静かに検証する。</span>
          </h1>
          <p className="mt-8 max-w-3xl text-[15px] leading-8 text-[#315244]/82 md:text-lg md:leading-9">
            iPhone運用では、NFC Toolsで短いURLをタグへ書き込みます。このページでは、書き込み予定URL、未登録時の案内、図鑑・音楽室・美術館DBの状態をまとめて確認できます。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <NfcVerifyConsole />
      </section>
    </main>
  )
}

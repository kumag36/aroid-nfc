import BrandHeader from '@/app/components/BrandHeader'
import NfcVerifyConsole from './NfcVerifyConsole'

export const metadata = {
  title: 'NFC検証室 | ZAMAKURI.JP',
  description: 'ざまくりプランツのNFCタグと各種DBの接続状態を確認する検証ページ。',
}

export default function NfcVerifyPage() {
  return (
    <main className="min-h-screen bg-[#06100b] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_78%_18%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_52%,#07110c_100%)] px-5 pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">
            NFC VERIFICATION ROOM
          </p>
          <h1 className="max-w-5xl text-[clamp(2.55rem,7vw,6.2rem)] font-medium leading-[1.08] tracking-normal">
            NFCタグとDBを
            <span className="block">検証する。</span>
          </h1>
          <p className="mt-8 max-w-3xl text-[15px] leading-8 text-[#eee7d7]/82 md:text-lg md:leading-9">
            書き込み予定のNFC IDを照合し、個体ページ、登録申請導線、図鑑・音楽室・美術館DBの進捗をまとめて確認します。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <NfcVerifyConsole />
      </section>
    </main>
  )
}

import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'

export default function Test() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_75%_20%,rgba(217,255,216,0.11),transparent_34%),linear-gradient(135deg,#050806_0%,#0d1d14_54%,#07110c_100%)] text-[#fffaf0] [font-family:'Yu_Mincho','Hiragino_Mincho_ProN','Noto_Serif_JP',serif]">
      <BrandHeader />
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-32">
        <div className="w-full max-w-3xl border border-[#fffaf0]/10 bg-[#07120d]/86 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.26)] md:p-12">
          <p className="mb-5 text-xs font-semibold tracking-[0.32em] text-[#b89558]">SYSTEM CHECK</p>
          <h1 className="text-[clamp(2.2rem,6vw,4.6rem)] font-medium leading-tight">TEST OK</h1>
          <p className="mt-7 text-[15px] leading-8 text-[#d8d0bf]/78 md:text-lg md:leading-9">
            表示確認用のページです。ブランドの世界観を崩さないよう、トップページと同じトーンで整えています。
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex min-h-12 min-w-44 items-center justify-center border border-[#d9ffd8]/65 bg-[#d9ffd8]/10 px-7 text-sm font-semibold tracking-[0.18em] text-[#eaffdf] shadow-[inset_0_0_0_1px_rgba(217,255,216,0.08),0_18px_60px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9ffd8] hover:text-[#07110c]">
              トップへ戻る
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

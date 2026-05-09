import ShokuchudokuCheck from './ShokuchudokuCheck'

export const metadata = {
  title: '植中毒 感染度チェック兼認定審査',
  description: '植物好きの感染度をチェックし、ZAMAKURI.JPで認定結果をストックする診断ページです。',
}

export default function ShokuchudokuPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07110c] text-[#fffef8] lg:bg-[radial-gradient(circle_at_18%_12%,rgba(217,255,216,0.14),transparent_22rem),#07110c]">
      <section className="relative mx-auto w-full max-w-[1040px] px-3 pb-1 pt-2 min-[430px]:px-4 lg:px-6 lg:pt-8">
        <div className="relative overflow-hidden rounded-[22px] border border-[#d9ffd8]/16 bg-[#10291e]/94 px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.3)] lg:px-7 lg:py-5">
          <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#d9ffd8]/14 blur-2xl" />
          <div className="absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-[#b89558]/18 blur-2xl" />
          <div className="relative flex items-end justify-between gap-3 lg:items-center">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] text-[#d9ffd8]">ZAMAKURI.JP</p>
              <h1 className="mt-1 text-[34px] leading-none !text-[#fffef8] lg:text-[56px]">植中毒</h1>
            </div>
            <p className="pb-1 text-right text-[11px] font-black leading-5 text-[#b89558] lg:text-[13px] lg:leading-6">
              感染度チェック
              <br />
              認定審査
            </p>
          </div>
        </div>
      </section>
      <ShokuchudokuCheck />
    </main>
  )
}

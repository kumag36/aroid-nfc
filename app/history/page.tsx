import BrandHeader from '@/app/components/BrandHeader'

export const metadata = {
  title: 'ヒストリー準備中 | ZAMAKURI.JP',
}

export default function HistoryPage() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <section className="px-5 pb-16 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <p className="zmk-eyebrow mb-5 text-[#b89558]">HISTORY</p>
          <h1 className="text-[#10291e]">🚧 ヒストリー準備中</h1>
          <p className="mt-7 text-[16px] font-bold leading-8 text-[#315244]">
            画像と内容の信頼性を優先するため、ヒストリーは一度整理しています。実際の記録に基づいて、あらためて公開します。
          </p>
        </div>
      </section>
    </main>
  )
}
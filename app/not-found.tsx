import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

export default function NotFound() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="404 / LOST LEAF"
        title={
          <>
            そのページ、
            <span className="block">まだ芽吹いてないみたい。</span>
          </>
        }
        lead="探してくれてありがとう。ここはまだ準備中の小さな鉢です。図鑑かトップに戻れば、いま育っているページたちに会えます。"
        actions={
          <>
            <Link href="/dictionary" className="zmk-button zmk-button-primary">
              図鑑へ戻る
            </Link>
            <Link href="/" className="zmk-button text-[#fffef8]">
              トップへ戻る
            </Link>
            <Link href="/register" className="zmk-button text-[#fffef8]">
              NFC登録へ
            </Link>
          </>
        }
      />
    </main>
  )
}

import Link from 'next/link'
import BrandHeader from './components/BrandHeader'
import PageHero from './components/PageHero'

export default function NotFound() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="404"
        title={<>そのページ、<span className="block">まだ芽吹いてないみたい。</span></>}
        lead="探してくれてありがとう。ここはまだ準備中の小さな鉢です。図鑑かトップへ戻ると、いま育っているページたちに会えます。"
        actions={
          <>
            <Link href="/dictionary" className="zmk-button zmk-button-primary">図鑑へ戻る</Link>
            <Link href="/" className="zmk-button">トップへ戻る</Link>
            <Link href="/about" className="zmk-button">ショップ情報へ</Link>
          </>
        }
      />
    </main>
  )
}
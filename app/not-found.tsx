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
        lead="探してくれてありがとう。いま開いている入口だけ、静かに並べています。"
        actions={
          <>
            <Link href="/shokuchudoku" className="zmk-button zmk-button-primary">植中毒へ</Link>
            <Link href="/lab" className="zmk-button">音楽へ</Link>
            <Link href="/museum" className="zmk-button">マンガへ</Link>
          </>
        }
      />
    </main>
  )
}

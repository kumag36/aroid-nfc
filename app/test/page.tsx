import Link from 'next/link'
import BrandHeader from '@/app/components/BrandHeader'
import PageHero from '@/app/components/PageHero'

export default function Test() {
  return (
    <main className="zmk-page">
      <BrandHeader />
      <PageHero
        eyebrow="SYSTEM CHECK"
        title="TEST OK"
        lead="表示確認用のページです。ブランドの世界観を崩さないよう、通常ページと同じ共通レイアウトで整えています。"
        actions={
          <Link href="/" className="zmk-button zmk-button-primary">
            トップへ戻る
          </Link>
        }
      />
    </main>
  )
}

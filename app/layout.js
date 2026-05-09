import './globals.css'
import MobileBottomNav from './components/MobileBottomNav'
import PageViewTracker from './components/PageViewTracker'
import SiteFooter from './components/SiteFooter'

export const metadata = {
  title: {
    default: 'ZAMAKURI.JP',
    template: '%s | ZAMAKURI.JP',
  },
  description: 'ざまくりプランツの公式サイト。ショップ情報、アロイド図鑑、物置を静かに記録するブランドサイトです。',
  applicationName: 'ZAMAKURI.JP',
  metadataBase: new URL('https://zamakuri.jp'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png?v=20260504', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=20260504', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png?v=20260504', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.ico?v=20260504', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png?v=20260504', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico?v=20260504'],
  },
  manifest: '/site.webmanifest?v=20260504',
  openGraph: {
    title: 'ZAMAKURI.JP',
    description: 'ざまくりプランツの公式サイト。ショップ情報、アロイド図鑑、物置を静かに記録します。',
    url: 'https://zamakuri.jp',
    siteName: 'ZAMAKURI.JP',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja" translate="no">
      <head>
        <link rel="preload" href="/fonts/Boku2-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Boku2-Bold.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Zamakuri-PMarker-Fallback.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>
        <PageViewTracker />
        {children}
        <SiteFooter />
        <MobileBottomNav />
      </body>
    </html>
  )
}

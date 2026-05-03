import './globals.css'
import MobileBottomNav from './components/MobileBottomNav'
import SiteFooter from './components/SiteFooter'

export const metadata = {
  title: {
    default: 'ZAMAKURI.JP',
    template: '%s | ZAMAKURI.JP',
  },
  description:
    'ざまくりプランツ公式サイト。アロイド図鑑、NFC個体管理DB、漫画室、音楽室を静かに記録するブランドサイト。',
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
    description: 'ざまくりプランツ公式サイト。',
    url: 'https://zamakuri.jp',
    siteName: 'ZAMAKURI.JP',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja" translate="no">
      <body>
        {children}
        <SiteFooter />
        <MobileBottomNav />
      </body>
    </html>
  )
}

import './globals.css'

export const metadata = {
  title: {
    default: 'ZAMAKURI.JP',
    template: '%s | ZAMAKURI.JP',
  },
  description:
    'ざまくりプランツ公式サイト。アロイド図鑑、NFC個体管理DB、美術館、音楽室を静かに記録するブランドサイト。',
  applicationName: 'ZAMAKURI.JP',
  metadataBase: new URL('https://zamakuri.jp'),
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
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '토탈프로 시뮬레이터',
  description: '토탈프로 키오스크 시뮬레이터',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

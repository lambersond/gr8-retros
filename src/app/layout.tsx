import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Geist, Geist_Mono as GeistMono } from 'next/font/google'
import { SessionWrapper } from '@/components/session-wrapper'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gr8 Retros',
  description: 'A simple and effective retrospective tool for teams.',
  metadataBase: new URL('https://gr8-retros.app'),
  openGraph: {
    title: 'Gr8 Retros',
    images: {
      url: '/logo.png',
      secureUrl: '/logo.png',
      alt: 'Gr8 Retros Logo',
      type: 'image/png',
      width: 64,
      height: 64,
    },
  },
  robots: 'index,follow',
  creator: 'David Lamberson',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <SessionWrapper>{children}</SessionWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

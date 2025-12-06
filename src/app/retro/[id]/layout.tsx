import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retro Board',
  robots: 'noindex,nofollow',
}

export default function RetroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

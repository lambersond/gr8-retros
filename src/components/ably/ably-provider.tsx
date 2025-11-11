'use client'

import * as Ably from 'ably'
import { AblyProvider as AProvider } from 'ably/react'

const client = new Ably.Realtime({
  authUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/ably/token`,
})

export function AblyProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AProvider client={client}>{children}</AProvider>
}

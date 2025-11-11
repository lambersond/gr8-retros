'use client'

import { ChannelProvider } from 'ably/react'

export function AblyChannelProvider({
  children,
  channel,
}: Readonly<{ children: React.ReactNode; channel: string }>) {
  return <ChannelProvider channelName={channel}>{children}</ChannelProvider>
}

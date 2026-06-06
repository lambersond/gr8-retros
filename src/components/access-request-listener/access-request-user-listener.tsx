'use client'

import { useChannel } from 'ably/react'
import { AblyChannelProvider } from '@/providers/ably'

export type AccessRequestResolvedMessage = {
  type: 'ACCESS_REQUEST_APPROVED' | 'ACCESS_REQUEST_REJECTED'
  boardId: string
}

type Props = {
  userId: string
  onResolved: (message: AccessRequestResolvedMessage) => void
}

// Subscribes the current user to their personal access-request channel so a
// manager's approve/reject reaches them even though they aren't on any board
// channel. Carries only { type, boardId }; consumers react via a server re-check.
export function AccessRequestUserListener({
  userId,
  onResolved,
}: Readonly<Props>) {
  const channel = `access-requests:${userId}`
  return (
    <AblyChannelProvider channel={channel}>
      <Subscriber channel={channel} onResolved={onResolved} />
    </AblyChannelProvider>
  )
}

function Subscriber({
  channel,
  onResolved,
}: Readonly<{
  channel: string
  onResolved: (message: AccessRequestResolvedMessage) => void
}>) {
  useChannel({ channelName: channel }, message => {
    const data = message.data as AccessRequestResolvedMessage | undefined
    if (
      data?.type === 'ACCESS_REQUEST_APPROVED' ||
      data?.type === 'ACCESS_REQUEST_REJECTED'
    ) {
      onResolved(data)
    }
  })
  return <></>
}

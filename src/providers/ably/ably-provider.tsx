'use client'

import { useEffect, useRef } from 'react'
import * as Ably from 'ably'
import Objects from 'ably/objects'
import { AblyProvider as AProvider } from 'ably/react'

const RECOVERY_KEY = 'ably-recovery-key'
export const ABLY_RECONNECTED_EVENT = 'ably:reconnected'

function createClient() {
  const recoveryKey =
    globalThis.window === undefined
      ? undefined
      : sessionStorage.getItem(RECOVERY_KEY)

  if (recoveryKey) sessionStorage.removeItem(RECOVERY_KEY)

  return new Ably.Realtime({
    authUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/ably/token`,
    plugins: { Objects },
    ...(recoveryKey ? { recover: recoveryKey } : {}),
  })
}

export function AblyProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const clientRef = useRef<Ably.Realtime | null>(null)
  clientRef.current ??= createClient()
  const client = clientRef.current

  useEffect(() => {
    const reconnectIfNeeded = () => {
      if (client.connection.state !== 'connected') {
        client.connect()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        reconnectIfNeeded()
      }
    }

    const handleBeforeUnload = () => {
      const key = client.connection.createRecoveryKey()
      if (key) sessionStorage.setItem(RECOVERY_KEY, key)
    }

    const handleConnected = (stateChange: Ably.ConnectionStateChange) => {
      const wasOffline =
        stateChange.previous === 'disconnected' ||
        stateChange.previous === 'suspended'

      if (wasOffline) {
        globalThis.dispatchEvent(new CustomEvent(ABLY_RECONNECTED_EVENT))
        console.warn('Ably reconnected after being offline')
      }
    }

    client.connection.on('connected', handleConnected)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    globalThis.addEventListener('online', reconnectIfNeeded)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      client.connection.off('connected', handleConnected)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      globalThis.removeEventListener('online', reconnectIfNeeded)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [client])

  return <AProvider client={client}>{children}</AProvider>
}

import { useEffect } from 'react'
import { useAbly } from 'ably/react'
import {
  clearFreshConnectionReload,
  reloadWithFreshConnection,
} from './recovery'
import { useAuth } from '@/hooks/use-auth'

/**
 * Makes sure a signed-in user's Ably connection is identified as that user.
 *
 * Presence, dice rolls and the chosen facilitator are all keyed by the Ably
 * clientId, so a connection still carrying a pre-sign-in (anonymous) identity
 * leaves a brand-new member unable to roll until they refresh. That happens
 * when the connection recovered after the sign-in redirect is the one opened
 * before signing in. A connection's clientId can't change, so the fix is a
 * reload on a fresh connection.
 */
export function useAblyIdentityGuard() {
  const ably = useAbly()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    const verifyIdentity = () => {
      const connectedAs = ably.auth.clientId
      if (!connectedAs) return

      if (connectedAs === user.id) {
        clearFreshConnectionReload()
        return
      }

      console.warn(
        `Ably connection is identified as "${connectedAs}" but the signed-in user is "${user.id}". Reloading on a fresh connection.`,
      )
      if (!reloadWithFreshConnection()) {
        console.error(
          'Ably connection identity still mismatched after reloading; not reloading again.',
        )
      }
    }

    verifyIdentity()
    ably.connection.on('connected', verifyIdentity)
    return () => {
      ably.connection.off('connected', verifyIdentity)
    }
  }, [ably, isAuthenticated, user.id])
}

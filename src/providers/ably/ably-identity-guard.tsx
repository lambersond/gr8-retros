'use client'

import { useAblyIdentityGuard } from './use-ably-identity-guard'

/**
 * Renders nothing; see `useAblyIdentityGuard`. Must sit inside both the Ably
 * and session providers.
 */
export function AblyIdentityGuard() {
  useAblyIdentityGuard()
  return <></>
}

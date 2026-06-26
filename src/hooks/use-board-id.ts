'use client'

import { useParams } from 'next/navigation'
import { decodeBoardId } from '@/lib/board-id'

/**
 * The current board id, decoded. Client `useParams()` returns the still-encoded
 * route segment (e.g. "new%20name%20with%20spaces"), but the canonical board id
 * — used for the DB, the Ably channel name, and the <AblyChannelProvider> — is
 * the decoded form. Always read the board id through this hook on the client so
 * channel names and API paths line up with the provider and server.
 */
export function useBoardId(): string {
  const { id } = useParams() satisfies { id: string }
  return decodeBoardId(id)
}

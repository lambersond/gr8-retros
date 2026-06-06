'use client'

import { useRouter } from 'next/navigation'
import { AccessRequestUserListener } from '@/components/access-request-listener'

// Refreshes the personal page when one of the user's access requests is
// approved or rejected, so the pending list and "My Boards" reflect it live.
export function MeAccessRequestRefresher({
  userId,
}: Readonly<{ userId: string }>) {
  const router = useRouter()
  return (
    <AccessRequestUserListener
      userId={userId}
      onResolved={() => router.refresh()}
    />
  )
}

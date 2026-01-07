import { Suspense } from 'react'
import { CircularLoader } from '@/components/common'
import { JoinLink } from '@/components/join-link'

export default async function InvitePage({
  params,
}: Readonly<{ params: Promise<{ token: string }> }>) {
  const { token } = await params
  return (
    <Suspense
      fallback={<CircularLoader fullscreen label='Loading Invitation...' />}
    >
      <JoinLink token={token} />
    </Suspense>
  )
}

import { Suspense } from 'react'
import { CircularLoader } from '@/components/common'
import { RetroBoard } from '@/components/retro-board'

export default async function RetroPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params

  return (
    <Suspense fallback={<CircularLoader fullscreen />}>
      <RetroBoard id={id} />
    </Suspense>
  )
}

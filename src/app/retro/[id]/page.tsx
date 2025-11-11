import { RetroBoard } from '@/components/retro-board'

export default async function RetroPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params

  return <RetroBoard id={id} />
}

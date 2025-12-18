import { useBoardControlsState } from '@/providers/retro-board/controls'

export function TimeRemaining() {
  const formatted = useBoardControlsState(s => s.formatted)
  return <>{formatted}</>
}

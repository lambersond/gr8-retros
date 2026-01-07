import { useAuth } from '@/hooks/use-auth'
import {
  useBoardPermissions,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function ClaimBoard() {
  const { claimBoardSettings } = useBoardSettingsActions()
  const { canClaimBoard } = useBoardPermissions()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated || !canClaimBoard) return

  return (
    <section className='flex-0 mb-4'>
      <button
        className='p-2 py-4 bg-info/80 hover:bg-info text-center shadow-lg rounded-lg w-full text-white cursor-pointer font-semibold'
        onClick={claimBoardSettings}
      >
        Claim this public board to unlock the settings
      </button>
    </section>
  )
}

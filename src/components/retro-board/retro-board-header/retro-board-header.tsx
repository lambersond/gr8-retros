'use client'

import { Settings } from 'lucide-react'
import { PhaseIndicators } from './phase-indicators'
import { RetroActions } from './retro-actions'
import { ViewingMembers } from './viewing-members'
import { BoardControls } from '@/components/board-controls'
import { useAuth } from '@/hooks/use-auth'
import { useBoardAccessRequests } from '@/providers/retro-board/board-access-requests'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function RetroBoardHeader({ id }: Readonly<{ id: string }>) {
  const { boardName } = useBoardSettings()

  return (
    <div className='bg-paper/50 px-3 py-2 flex flex-col gap-2'>
      <div className='flex items-center gap-3'>
        <div className='flex-1 min-w-0'>
          <h1 className='truncate font-semibold text-text-primary'>
            <span className='text-text-secondary mr-1'>Retro Session:</span>
            {boardName}
          </h1>
        </div>
        <div className='flex-1 flex justify-center min-w-0'>
          <BoardControls />
        </div>
        <div className='flex-1 flex justify-end'>
          <BoardSettingsButton />
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <div className='flex-1 min-w-0'>
          <ViewingMembers />
        </div>
        <div className='flex-1 flex justify-center min-w-0'>
          <PhaseIndicators />
        </div>
        <div className='flex-1 flex justify-end'>
          <RetroActions id={id} />
        </div>
      </div>
    </div>
  )
}

function BoardSettingsButton() {
  const { openSidebar } = useBoardSettingsActions()
  const { isClaimed } = useBoardSettings()
  const { isAuthenticated } = useAuth()
  const { user } = useBoardPermissions()
  const { pending } = useBoardAccessRequests()

  const showSettingsButton = (isAuthenticated && !isClaimed) || user.hasMember
  if (!showSettingsButton) return

  const pendingCount = user.hasFacilitator ? pending.length : 0

  return (
    <button
      type='button'
      onClick={openSidebar}
      className='relative flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer text-text-primary hover:bg-text-primary/10'
    >
      <span className='hidden md:inline text-sm font-medium'>
        Board Settings
      </span>
      <Settings className='size-5' />
      {pendingCount > 0 && (
        <span className='absolute -top-1 -right-1 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-warning text-white text-[10px] font-semibold'>
          {pendingCount}
        </span>
      )}
    </button>
  )
}

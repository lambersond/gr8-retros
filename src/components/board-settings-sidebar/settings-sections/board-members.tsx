import { useMemo } from 'react'
import { ChevronRight, Users } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardMembers,
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import { useViewingMembers } from '@/providers/viewing-members'

export function BoardMembers() {
  const { boardTier, id } = useBoardSettings()
  const members = useBoardMembers()
  const { viewingMembers } = useViewingMembers()
  const {
    canClaimBoard,
    user: { hasAdmin },
  } = useBoardPermissions()
  const { openModal } = useModals()
  const {
    user: { id: currentUserId },
  } = useAuth()

  const availableMembers = useMemo(() => {
    const result = []
    for (const [id, userDetails] of Object.entries(viewingMembers)) {
      if (userDetails.isAuthenticated && !members.some(m => m.user.id === id)) {
        result.push({
          id: id,
          name: userDetails.name,
          image: userDetails.image,
        })
      }
    }
    return result
  }, [members, viewingMembers])

  const handleOpenManageUsersModal = () => {
    openModal('ManageUsersModal', {
      members,
      currentUserId,
      availableMembers,
      settingsId: id,
      hasEdit: hasAdmin,
      enableAdminElection: boardTier !== 'FREE',
    })
  }

  if (canClaimBoard) return

  return (
    <button
      onClick={handleOpenManageUsersModal}
      disabled={members.length === 0}
      className='group w-full flex items-center justify-between px-4 py-3 bg-paper border border-border-light hover:border-primary-new rounded-lg transition-colors cursor-pointer'
    >
      <div className='flex items-center gap-2'>
        <Users className='size-5 text-primary-new' />
        <span className='font-medium text-text-primary'>Board Members</span>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-text-secondary'>{members.length}</span>
        {members.length > 0 && (
          <ChevronRight className='size-4 text-text-tertiary ml-auto group-hover:text-primary-new' />
        )}
      </div>
    </button>
  )
}

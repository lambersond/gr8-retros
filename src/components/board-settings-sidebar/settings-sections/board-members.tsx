import { ChevronRight, Users } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardMembers,
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'

export function BoardMembers() {
  const { boardTier, id } = useBoardSettings()
  const members = useBoardMembers()
  const {
    canClaimBoard,
    user: { hasAdmin },
  } = useBoardPermissions()
  const { openModal } = useModals()
  const {
    user: { id: currentUserId },
  } = useAuth()

  const handleOpenManageUsersModal = () => {
    openModal('ManageUsersModal', {
      members,
      currentUserId,
      hasEdit: hasAdmin,
      enableAdminElection: boardTier !== 'FREE',
      onRoleChange(userId, newRole) {
        fetch(`/api/board-settings/${id}/member`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ memberUserId: userId, newRole }),
        })
      },
      onRemoveUser(userId) {
        fetch(`/api/board-settings/${id}/member`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ memberUserId: userId }),
        })
      },
    })
  }

  if (canClaimBoard) return

  return (
    <button
      onClick={handleOpenManageUsersModal}
      disabled={members.length === 0}
      className='w-full flex items-center justify-between px-4 py-3 bg-neutral-50 border border-border-light hover:border-primary-new rounded-lg hover:bg-white transition-colors cursor-pointer'
    >
      <div className='flex items-center gap-2'>
        <Users className='size-5 text-primary-new' />
        <span className='font-medium text-text-primary'>Board Members</span>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-text-secondary'>{members.length}</span>
        {members.length > 0 && (
          <ChevronRight className='w-4 h-4 text-text-tertiary' />
        )}
      </div>
    </button>
  )
}

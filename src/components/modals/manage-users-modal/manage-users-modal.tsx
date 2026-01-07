import { useCallback } from 'react'
import { Trash } from 'lucide-react'
import { ROLES } from './constants'
import { Dropdown, IconButton, Modal } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import type { ManageUsersModalProps } from './types'

export function ManageUsersModal({
  members = [],
  enableAdminElection = false,
  open = true,
  hasEdit,
  currentUserId,
  onRoleChange,
  onRemoveUser,
}: Readonly<ManageUsersModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('ManageUsersModal')
  }

  const rolesList = Object.values(ROLES).filter(role => {
    if (!enableAdminElection && role.id === ROLES.ADMIN.id) {
      return false
    }
    return true
  })

  const handleRoleChange =
    (userId: string) =>
    ({ value }: any) => {
      onRoleChange(userId, value)
    }

  const handleRemoveUser = (userId: string) => () => {
    onRemoveUser(userId)
  }

  const getDefaultRole = (currentRole: keyof typeof ROLES) => {
    return ROLES[currentRole]
  }

  const renderUserActions = useCallback(
    (member: any) => {
      if (member.role === 'OWNER') {
        return (
          <span className='px-2 py-1 text-sm bg-gray-200 rounded'>Owner</span>
        )
      }

      if (hasEdit) {
        return (
          <>
            <Dropdown
              options={rolesList}
              onSelect={handleRoleChange(member.user.id)}
              selected={getDefaultRole(member.role)}
              width='w-28'
              size='sm'
            />
            <IconButton
              icon={Trash}
              intent='danger'
              size='sm'
              onClick={handleRemoveUser(member.user.id)}
            />
          </>
        )
      }

      return (
        <span className='px-2 py-1 text-sm bg-gray-200 rounded'>
          {ROLES[member.role].label}
        </span>
      )
    },
    [hasEdit, handleRoleChange, rolesList, handleRemoveUser],
  )

  return (
    <Modal title='Registered Users' isOpen={open} onClose={onClose}>
      {members.map(member => (
        <div
          key={member.user.id}
          className='p-2 border-b first:border-t flex justify-between items-center border-neutral-300'
        >
          <span className='flex gap-1 items-center'>
            <p className='text-lg'>{member.user.name}</p>
            {member.user.id === currentUserId && (
              <p className='text-sm text-primary-new/60 px-1 bg-info/10 rounded'>
                You
              </p>
            )}
          </span>
          <div className='flex gap-2 items-center'>
            {renderUserActions(member)}
          </div>
        </div>
      ))}
    </Modal>
  )
}

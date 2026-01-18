import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import { ROLES } from './constants'
import { Dropdown, IconButton, Modal } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import type { ManageUsersModalProps } from './types'

export function ManageUsersModal({
  availableMembers = [],
  members = [],
  enableAdminElection = false,
  open = true,
  hasEdit,
  currentUserId,
  settingsId,
}: Readonly<ManageUsersModalProps>) {
  const { closeModal } = useModals()
  const [membersList, setMembersList] = useState(members)
  const [availableUsers, setAvailableUsers] = useState(availableMembers)

  useEffect(() => {
    if (!open) return
    setMembersList(members)
    setAvailableUsers(availableMembers)
  }, [open, members])

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
      fetch(`/api/board-settings/${settingsId}/member`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberUserId: userId, newRole: value }),
      })
    }

  const handleRemoveUser = (userId: string) => () => {
    setMembersList(prev => prev.filter(member => member.user.id !== userId))
    fetch(`/api/board-settings/${settingsId}/member`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberUserId: userId }),
    })
  }

  const handleAddUser = async ({ value }: any) => {
    const res = await fetch(`/api/board-settings/${settingsId}/member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newMemberId: value }),
    })

    const newMember = await res.json()

    setMembersList(prev => [...prev, newMember])
    setAvailableUsers(prev => prev.filter(user => user.id !== value))
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

  const dropdownOptions = useMemo(
    () =>
      availableUsers.map(user => ({
        id: user.id,
        label: (
          <div className='flex items-center text-lg'>
            <Image
              src={user.image}
              alt={user.name}
              width={24}
              height={24}
              className='rounded-full mr-2 inline-block'
            />
            {user.name}
          </div>
        ),
        value: user.id,
      })),
    [availableUsers],
  )

  return (
    <Modal title='Registered Users' isOpen={open} onClose={onClose}>
      {availableUsers.length > 0 && (
        <div className='mb-2'>
          <Dropdown
            options={dropdownOptions}
            onSelect={handleAddUser}
            width='w-small'
            placeholder='Add New Member...'
            defaultEmpty
          />
        </div>
      )}
      {membersList.map(member => (
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

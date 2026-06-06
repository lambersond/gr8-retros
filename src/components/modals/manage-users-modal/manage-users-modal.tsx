import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { ChevronDown, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { ROLES } from './constants'
import { Dropdown, IconButton, Modal } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import type { ManageUsersModalProps } from './types'
import type { AccessRequestItem } from '@/providers/retro-board/board-access-requests'

export function ManageUsersModal({
  availableMembers = [],
  members = [],
  enableAdminElection = false,
  open = true,
  hasEdit,
  currentUserId,
  settingsId,
  canManageRequests = false,
  pendingRequests = [],
  declinedRequests = [],
}: Readonly<ManageUsersModalProps>) {
  const { closeModal } = useModals()
  const [membersList, setMembersList] = useState(members)
  const [availableUsers, setAvailableUsers] = useState(availableMembers)
  const [pendingList, setPendingList] = useState(pendingRequests)
  const [declinedList, setDeclinedList] = useState(declinedRequests)
  const [showDeclined, setShowDeclined] = useState(false)

  useEffect(() => {
    if (!open) return
    setMembersList(members)
    setAvailableUsers(availableMembers)
    setPendingList(pendingRequests)
    setDeclinedList(declinedRequests)
    // Snapshots from the sidebar can be stale; pull the latest on open.
    if (canManageRequests) {
      fetch(`/api/board-settings/${settingsId}/access-request`)
        .then(res => (res.ok ? res.json() : undefined))
        .then(data => {
          if (!data) return
          setPendingList(data.pending ?? [])
          setDeclinedList(data.declined ?? [])
        })
        .catch(() => {})
    }
  }, [open, members, settingsId, canManageRequests])

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

  const actOnRequest = async (userId: string, action: 'approve' | 'reject') => {
    const res = await fetch(
      `/api/board-settings/${settingsId}/access-request`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterUserId: userId, action }),
      },
    )
    return res.ok
  }

  // Approve drops the requester into the member list (role MEMBER), editable
  // like any other member; used for both pending approvals and re-approvals.
  const handleApprove = (request: AccessRequestItem) => async () => {
    const ok = await actOnRequest(request.user.id, 'approve')
    if (!ok) return
    setPendingList(prev => prev.filter(r => r.user.id !== request.user.id))
    setDeclinedList(prev => prev.filter(r => r.user.id !== request.user.id))
    setMembersList(prev =>
      prev.some(member => member.user.id === request.user.id)
        ? prev
        : [
            ...prev,
            {
              user: {
                id: request.user.id,
                name: request.user.name ?? '',
                image: request.user.image ?? undefined,
              },
              role: 'MEMBER',
              permissionMask: 0,
            } as (typeof prev)[number],
          ],
    )
  }

  const handleReject = (request: AccessRequestItem) => async () => {
    const ok = await actOnRequest(request.user.id, 'reject')
    if (!ok) return
    setPendingList(prev => prev.filter(r => r.user.id !== request.user.id))
    setDeclinedList(prev => [...prev, { ...request, status: 'REJECTED' }])
  }

  const getDefaultRole = (currentRole: keyof typeof ROLES) => {
    return ROLES[currentRole]
  }

  const renderUserActions = useCallback(
    (member: any) => {
      if (member.role === 'OWNER') {
        return <span className='px-2 py-1 text-sm bg-paper rounded'>Owner</span>
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
              icon={Trash2}
              intent='danger'
              size='sm'
              onClick={handleRemoveUser(member.user.id)}
            />
          </>
        )
      }

      return (
        <span className='px-2 py-1 text-sm bg-paper rounded'>
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
    <Modal title='Board Members' isOpen={open} onClose={onClose}>
      {canManageRequests && pendingList.length > 0 && (
        <div className='mb-3'>
          <p className='text-sm font-semibold text-text-secondary mb-1'>
            Pending Requests
          </p>
          {pendingList.map(request => (
            <div
              key={request.user.id}
              className='p-2 border-t flex justify-between items-center border-border-light'
            >
              <p className='text-lg'>{request.user.name}</p>
              <div className='flex gap-2 items-center'>
                <button
                  onClick={handleApprove(request)}
                  className='px-3 py-1 text-sm font-medium rounded bg-primary/85 hover:bg-primary text-text-primary cursor-pointer'
                >
                  Approve
                </button>
                <button
                  onClick={handleReject(request)}
                  className='px-3 py-1 text-sm font-medium rounded bg-danger/85 hover:bg-danger text-white cursor-pointer'
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
          className='p-2 not-last:border-b first:border-t flex justify-between items-center border-border-light'
        >
          <span className='flex gap-1 items-center'>
            <p className='text-lg'>{member.user.name}</p>
            {member.user.id === currentUserId && (
              <p className='text-sm text-primary px-1 bg-info/10 rounded'>
                You
              </p>
            )}
          </span>
          <div className='flex gap-2 items-center'>
            {renderUserActions(member)}
          </div>
        </div>
      ))}

      {canManageRequests && declinedList.length > 0 && (
        <div className='mt-3'>
          <button
            type='button'
            onClick={() => setShowDeclined(prev => !prev)}
            className='flex items-center gap-1 text-sm text-text-secondary cursor-pointer hover:text-text-primary'
          >
            <ChevronDown
              className={clsx(
                'size-4 transition-transform',
                showDeclined && 'rotate-180',
              )}
            />
            Declined ({declinedList.length})
          </button>
          {showDeclined &&
            declinedList.map(request => (
              <div
                key={request.user.id}
                className='p-2 border-t flex justify-between items-center border-border-light'
              >
                <p className='text-lg text-text-secondary'>
                  {request.user.name}
                </p>
                <button
                  onClick={handleApprove(request)}
                  className='px-3 py-1 text-sm font-medium rounded bg-primary/85 hover:bg-primary text-text-primary cursor-pointer'
                >
                  Re-approve
                </button>
              </div>
            ))}
        </div>
      )}
    </Modal>
  )
}

import Image from 'next/image'
import { Modal } from '@/components/common'
import { UpsertActionItemForm } from '@/components/forms/upsert-action-item-form'
import { useModals } from '@/hooks/use-modals'
import type { UpsertActionItemModalProps } from './types'

export function UpsertActionItemModal({
  apiPath,
  open = true,
  defaultContent,
  assignedToId,
  placeholder,
  title = 'Add Action Item',
  assignableUsers = [],
}: Readonly<UpsertActionItemModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('UpsertActionItemModal')
  }

  const formatedAssignableUsers = assignableUsers.map(user => ({
    id: user.id,
    value: user.id,
    label: (
      <div className='flex items-center gap-2'>
        {user.image && (
          <Image
            src={user.image}
            alt={user.name}
            width={24}
            height={24}
            className='w-6 h-6 rounded-full'
          />
        )}
        <span>{user.name}</span>
      </div>
    ),
  }))

  const handleSubmit = (content: string, assignedToId: string) => {
    fetch(apiPath, {
      method: defaultContent ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content, assignedToId }),
    })
    onClose()
  }

  return (
    <Modal title={title} isOpen={open} onClose={onClose}>
      <UpsertActionItemForm
        defaultContent={defaultContent}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        availableUsers={formatedAssignableUsers}
        defaultAssignedToId={assignedToId}
      />
    </Modal>
  )
}

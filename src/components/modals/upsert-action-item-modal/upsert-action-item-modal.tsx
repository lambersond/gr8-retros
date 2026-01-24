import Image from 'next/image'
import { Modal } from '@/components/common'
import { UpsertActionItemForm } from '@/components/forms/upsert-action-item-form'
import { useModals } from '@/hooks/use-modals'
import type { UpsertActionItemModalProps } from './types'

export function UpsertActionItemModal({
  open = true,
  defaultContent,
  assignedToId,
  placeholder,
  title = 'Add Action Item',
  onSubmit,
  onDelete,
  assignableUsers = [],
}: Readonly<UpsertActionItemModalProps>) {
  const { closeModal, openModal } = useModals()

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
    onSubmit({ content, assignedToId })
    onClose()
  }

  const handleOnDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!onDelete) return

    openModal('ConfirmModal', {
      title: 'Delete Action Item',
      color: 'danger',
      message: 'Are you sure you want to delete this action item?',
      onConfirm: () => {
        onDelete()
        onClose()
      },
    })
  }

  return (
    <Modal title={title} isOpen={open} onClose={onClose}>
      <UpsertActionItemForm
        defaultContent={defaultContent}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        availableUsers={formatedAssignableUsers}
        defaultAssignedToId={assignedToId}
        showDelete={Boolean(onDelete)}
        onDelete={handleOnDelete}
      />
    </Modal>
  )
}

import { Modal } from '@/components/common'
import { CreateCardGroupForm } from '@/components/forms/create-card-group-form'
import { useModals } from '@/hooks/use-modals'
import type { EditCardGroupModalProps } from './types'

export function EditCardGroupModal({
  currentLabel,
  onSubmit,
  open = true,
}: Readonly<EditCardGroupModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('EditCardGroupModal')
  }

  const handleOnSubmit = (label: string) => {
    onSubmit(label)
    onClose()
  }

  return (
    <Modal title='Edit Group' isOpen={open} onClose={onClose}>
      <CreateCardGroupForm
        defaultLabel={currentLabel}
        onSubmit={handleOnSubmit}
      />
    </Modal>
  )
}

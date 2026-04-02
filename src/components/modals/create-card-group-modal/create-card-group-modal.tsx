import { Modal } from '@/components/common'
import { CreateCardGroupForm } from '@/components/forms/create-card-group-form'
import { useModals } from '@/hooks/use-modals'
import type { CreateCardGroupModalProps } from './types'

export function CreateCardGroupModal({
  onSubmit,
  open = true,
}: Readonly<CreateCardGroupModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('CreateCardGroupModal')
  }

  const handleOnSubmit = (label: string) => {
    onSubmit(label)
    onClose()
  }

  return (
    <Modal title='Create Group' isOpen={open} onClose={onClose}>
      <CreateCardGroupForm onSubmit={handleOnSubmit} />
    </Modal>
  )
}

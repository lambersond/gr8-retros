import { CreateBoardModalProps } from './types'
import { Modal } from '@/components/common'
import { CreateBoardForm } from '@/components/forms/create-board-form'
import { useModals } from '@/hooks/use-modals'

export function CreateBoardModal({
  open = true,
}: Readonly<CreateBoardModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('CreateBoardModal')
  }

  const handleConfirm = () => {
    // fetch(...) create board api call
    onClose()
  }

  return (
    <Modal title='Create New Board' isOpen={open} onClose={onClose}>
      <CreateBoardForm onSubmit={handleConfirm} />
    </Modal>
  )
}

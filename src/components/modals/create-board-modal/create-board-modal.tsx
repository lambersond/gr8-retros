import { useRouter } from 'next/navigation'
import { Modal } from '@/components/common'
import { CreateBoardForm } from '@/components/forms/create-board-form'
import { useModals } from '@/hooks/use-modals'
import type { CreateBoardModalProps } from './types'

export function CreateBoardModal({
  open = true,
  onSubmit,
}: Readonly<CreateBoardModalProps>) {
  const { closeModal } = useModals()
  const router = useRouter()

  const onClose = () => {
    closeModal('CreateBoardModal')
  }

  const handleConfirm = async ({ boardName }: { boardName: string }) => {
    const resp = await fetch('/api/board', {
      method: 'POST',
      body: JSON.stringify({ boardName }),
    })

    const body = await resp.json()

    if (onSubmit) {
      await onSubmit({ boardId: body.id })
    }

    router.push(`/retro/${body.id}`)
    onClose()
  }

  return (
    <Modal title='Create New Board' isOpen={open} onClose={onClose}>
      <CreateBoardForm onSubmit={handleConfirm} />
    </Modal>
  )
}

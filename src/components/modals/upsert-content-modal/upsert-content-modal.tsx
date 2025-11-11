import { Modal } from '@/components/common'
import { ContentForm } from '@/components/forms/content-form'
import { useModals } from '@/hooks/use-modals'
import type { UpsertContentModalProps } from './types'

export function UpsertContentModal({
  onSubmit,
  open = true,
  defaultContent,
  placeholder,
  title = 'Confirmation',
}: Readonly<UpsertContentModalProps>) {
  const { closeModal } = useModals()

  const onClose = () => {
    closeModal('UpsertContentModal')
  }

  const handleSubmit = (data: string) => {
    onSubmit(data)
    onClose()
  }

  return (
    <Modal title={title} isOpen={open} onClose={onClose}>
      <ContentForm
        defaultContent={defaultContent}
        onSubmit={handleSubmit}
        placeholder={placeholder}
      />
    </Modal>
  )
}

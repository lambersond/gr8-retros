import type { ModalProps } from '../types'

export interface ConfirmModalProps extends ModalProps {
  onConfirm: VoidFunction
  // Called when the user turns the confirmation down (the cancel button, the
  // close button or the backdrop), but not on confirm or when something else
  // closes the modal.
  onCancel?: VoidFunction
  message?: string | React.ReactNode
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  hideCancelButton?: boolean
  color?: 'primary' | 'danger'
}

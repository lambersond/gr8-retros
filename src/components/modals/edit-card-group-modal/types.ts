import type { ModalProps } from '../types'

export interface EditCardGroupModalProps extends ModalProps {
  currentLabel: string
  onSubmit: (label: string) => Promise<void> | void
}

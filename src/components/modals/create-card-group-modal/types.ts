import type { ModalProps } from '../types'

export interface CreateCardGroupModalProps extends ModalProps {
  onSubmit: (label: string) => Promise<void> | void
}

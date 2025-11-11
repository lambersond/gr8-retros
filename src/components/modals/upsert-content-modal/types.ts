import type { ModalProps } from '../types'

export interface UpsertContentModalProps extends ModalProps {
  onSubmit: (data: string) => Promise<void> | void
  defaultContent?: string
  title?: string
  placeholder?: string
}

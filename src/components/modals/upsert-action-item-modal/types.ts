import type { ModalProps } from '../types'

export interface UpsertActionItemModalProps extends ModalProps {
  assignableUsers?: {
    id: string
    name: string
    image: string | undefined
  }[]
  defaultContent?: string
  assignedToId?: string
  placeholder?: string
  title?: string
  onDelete?(): void
  onSubmit: (data: ActionItemSubmissionData) => void
}

type ActionItemSubmissionData = {
  content: string
  assignedToId?: string
}

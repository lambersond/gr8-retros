import type { ModalProps } from '../types'

export interface UpsertActionItemModalProps extends ModalProps {
  apiPath: string
  assignableUsers?: {
    id: string
    name: string
    image: string | undefined
  }[]
  defaultContent?: string
  assignedToId?: string
  placeholder?: string
  title?: string
}

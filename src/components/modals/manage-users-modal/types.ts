import type { ModalProps } from '../types'
import type { BoardMember } from '@/types'

export interface ManageUsersModalProps extends ModalProps {
  members: BoardMember[]
  hasEdit: boolean
  availableMembers?: {
    id: string
    name: string
    image: string
  }[]
  settingsId: string
  currentUserId?: string
  enableAdminElection?: boolean
}

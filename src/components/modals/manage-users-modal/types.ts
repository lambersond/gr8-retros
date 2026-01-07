import type { ModalProps } from '../types'
import type { BoardMember, BoardRole } from '@/types'

export interface ManageUsersModalProps extends ModalProps {
  members: BoardMember[]
  hasEdit: boolean
  currentUserId?: string
  enableAdminElection?: boolean
  onRoleChange: (userId: string, newRole: BoardRole) => void
  onRemoveUser: (userId: string) => void
}

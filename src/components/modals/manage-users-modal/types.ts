import type { ModalProps } from '../types'
import type { BoardRole } from '@/enums'
import type { BoardMember } from '@/types'

export interface ManageUsersModalProps extends ModalProps {
  members: BoardMember[]
  hasEdit: boolean
  currentUserId?: string
  enableAdminElection?: boolean
  onRoleChange: (userId: string, newRole: BoardRole) => void
  onRemoveUser: (userId: string) => void
}

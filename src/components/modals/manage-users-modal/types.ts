import type { ModalProps } from '../types'
import type { AccessRequestItem } from '@/providers/retro-board/board-access-requests'
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
  canManageRequests?: boolean
  pendingRequests?: AccessRequestItem[]
  declinedRequests?: AccessRequestItem[]
}

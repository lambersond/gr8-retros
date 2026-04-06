import type { ModalProps } from '../types'
import type { BoardMember } from '@/types'

export interface TransferBoardModalProps extends ModalProps {
  admins: BoardMember[]
  settingsId: string
  onTransfer: (result: { deactivateFacilitatorMode: boolean }) => void
}

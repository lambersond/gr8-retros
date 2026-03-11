import type { ModalProps } from '../types'

export interface CreateBoardModalProps extends ModalProps {
  onSubmit?: (data: { boardId: string }) => Promise<void>
}

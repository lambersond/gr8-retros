import type { ModalProps } from '../types'

export interface GroupUpvoteCard {
  id: string
  content: string
  upvotes: number
  isUpvoted: boolean
}

export interface GroupUpvoteModalProps extends ModalProps {
  cards: GroupUpvoteCard[]
  onUpvote: (cardId: string) => void
}

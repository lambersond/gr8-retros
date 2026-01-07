import type { ColumnType } from './models'

export { BoardRole, PaymentTier } from '@prisma/client'

interface CardId {
  cardId: string
}

export type CreateCardParams = {
  boardId: string
  column: ColumnType
  content: string
  creatorId: string
  creatorName?: string
}

export interface MarkCardDiscussedParams extends CardId {
  isDiscussed: boolean
}

export interface AddActionItemParams extends CardId {
  actionItemContent: string
}

export interface UpvoteCardParams extends CardId {
  upvotedBy: string[]
}

export interface EditCardContentParams extends CardId {
  newContent: string
  userId: string
}

export interface CreateActionItemParams extends CardId {
  content: string
  createdBy: string
}

export interface MarkDoneActionItemParams {
  actionItemId: string
  isDone: boolean
}

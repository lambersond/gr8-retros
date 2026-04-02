interface CardId {
  cardId: string
}

export type CreateCardParams = {
  boardId: string
  column: string
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

export interface CreateActionItemParams {
  boardId: string
  item: {
    cardId: string
    content: string
    createdBy: string
    assignedToId?: string
  }
}

export interface MarkDoneActionItemParams {
  actionItemId: string
  isDone: boolean
}

export interface UpdateCardPositionParams {
  cardId: string
  position: number
}

export interface AddCardToGroupParams {
  cardId: string
  cardGroupId: string
}

export interface RemoveCardFromGroupParams {
  cardId: string
  position?: number
  column?: string
}

export interface CreateCardGroupParams {
  boardId: string
  column: string
  label: string
  cardId1: string
  cardId2: string
  position?: number
}

export interface EditCardGroupParams {
  cardGroupId: string
  label?: string
  position?: number
  column?: string
}

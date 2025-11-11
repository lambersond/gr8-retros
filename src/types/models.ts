export type ColumnType = 'GOOD' | 'MEH' | 'BAD' | 'SHOUTOUT'

export type Board = {
  id: string
  name: string | null
  org: string | null
  isTemp: boolean
  isPrivate: boolean
  creatorId: string | null
  createdAt: Date
  updatedAt: Date
  cards: {
    id: string
    creatorId: string
    createdAt: Date
    updatedAt: Date
    retroSessionId: string
    content: string
    column: string
    isDiscussed: boolean
    upvotedBy: string[]
    position: number
    createdBy: string
    actionItems: {
      cardId: string
      content: string
      createdAt: Date
      createdBy: string
      id: string
      isDone: boolean
      updatedAt: Date
    }[]
  }[]
  users: {
    userId: string
  }[]
}

export type Card = Board['cards'][number]
export type ActionItem = Card['actionItems'][number]

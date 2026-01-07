import type { BoardRole, PaymentTier } from '@/types'

export type ColumnType = 'GOOD' | 'MEH' | 'BAD' | 'SHOUTOUT'

export type Board = {
  id: string
  name: string | null
  org: string | null
  creatorId: string | null
  createdAt: Date
  updatedAt: Date
  settings: {
    id: string
    boardTier: PaymentTier
    isUpvotingEnabled: boolean
    upvoteLimit: number
    upvoteAnytime: boolean
    isMusicEnabled: boolean
    musicAnytime: boolean
    isTimerEnabled: boolean
    timerDefault: number
    timerAnytime: boolean
    isCommentsEnabled: boolean
    commentsAnytime: boolean
    isCardGroupingEnabled: boolean
    cardGroupingAnytime: boolean
    isAiNamingEnabled: boolean
    isAiSummaryEnabled: boolean
    isFocusModeEnabled: boolean
    isPrivate: boolean
    privateOpenAccess: boolean
    invite:
      | ({
          token: string
          expiresAt: Date | null
        } & Record<string, unknown>)
      | undefined
    ownerId: string | null
    retroSessionId: string
    createdAt: Date
    updatedAt: Date
    members: {
      role: BoardRole
      permissionMask: number
      user: {
        id: string
        name: string
      }
    }[]
  }
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
    comments: {
      id: string
      cardId: string
      content: string
      createdAt: Date
      createdBy: string
      creatorId: string
    }[]
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
export type Comment = Card['comments'][number]
export type BoardSettings = Board['settings']
export type BoardInvite = BoardSettings['invite']
export type BoardMember = BoardSettings['members'][number]

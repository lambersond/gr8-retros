import type { BoardRole, PaymentTier } from '@/enums'

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
    cardGroupingAnytime: boolean
    commentsAnytime: boolean
    isAiNamingEnabled: boolean
    isAiSummaryEnabled: boolean
    isCardGroupingEnabled: boolean
    isCommentsEnabled: boolean
    isFocusModeEnabled: boolean
    isMusicEnabled: boolean
    isPrivate: boolean
    isTimerEnabled: boolean
    isUpvotingEnabled: boolean
    musicAnytime: boolean
    musicRestricted: boolean
    privateCardRetention: number
    privateOpenAccess: boolean
    timerAnytime: boolean
    timerDefault: number
    timerRestricted: boolean
    upvoteAnytime: boolean
    upvoteLimit: number
    upvoteRestricted: boolean
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
        image: string | undefined
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
      assignedToId: string | undefined
      assignedTo:
        | {
            id: string
            name: string
            image: string | undefined
          }
        | undefined
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

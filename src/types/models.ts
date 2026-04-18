import type { BoardRole, PaymentTier, VotingMode } from '@/enums'

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
    isActionItemsEnabled: boolean
    isAiSummaryEnabled: boolean
    isCommentsEnabled: boolean
    isDragAndDropEnabled: boolean
    isFacilitatorModeEnabled: boolean
    isMusicEnabled: boolean
    isPrivate: boolean
    isTimerEnabled: boolean
    isUpvotingEnabled: boolean
    isVotingEnabled: boolean
    actionItemsAnytime: boolean
    actionItemsRestricted: boolean
    aiCardGroupNamingEnabled: boolean
    cardGroupingEnabled: boolean
    commentsAnytime: boolean
    commentsRestricted: boolean
    musicAnytime: boolean
    musicRestricted: boolean
    privateCardRetention: number
    privateOpenAccess: boolean
    timerDefault: number
    timerRestricted: boolean
    upvoteAnytime: boolean
    upvoteLimit: number
    upvoteRestricted: boolean
    votingLimit: number
    votingMode: VotingMode
    votingRestricted: boolean
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
    columns: {
      id: string
      index: number
      boardSettingsId: string
      tagline: string | undefined
      placeholder: string | undefined
      columnType: string
      label: string
      emoji: string | undefined
      lightBg: string
      lightBorder: string
      lightTitleBg: string
      lightTitleText: string
      darkBg: string
      darkBorder: string
      darkTitleBg: string
      darkTitleText: string
      createdAt: Date
      updatedAt: Date
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
    votes: number
    position: number | null | undefined
    createdBy: string
    cardGroupId: string | null
    comments: {
      id: string
      cardId: string
      content: string
      createdAt: Date
      updatedAt: Date
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
  cardGroups: {
    id: string
    label: string
    column: string
    position: number
    retroSessionId: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export type Card = Board['cards'][number]
export type ActionItem = Card['actionItems'][number]
export type Comment = Card['comments'][number]
export type BoardSettings = Board['settings']
export type BoardInvite = BoardSettings['invite']
export type BoardMember = BoardSettings['members'][number]
export type Column = BoardSettings['columns'][number]
export type CardGroup = Board['cardGroups'][number]

export type ColumnItem =
  | { kind: 'card'; data: Card }
  | { kind: 'group'; data: CardGroup }

import type { BoardSettingsWithPermissions } from '@/providers/retro-board/board-settings/types'
import type { CardGroupState } from '@/providers/retro-board/cards'
import type { ActionItem, Card } from '@/types'

export interface CardGroupProps {
  group: CardGroupState
  currentUserId?: string
  isMergeTarget?: boolean
  onRemoveCard?: (groupId: string, cardId: string) => void
  votes?: number
}

export interface CardGroupAggregates {
  totalUpvotes: number
  totalComments: number
  allDiscussed: boolean
  allActionItems: (ActionItem & { cardId: string })[]
  actionItemsExist: boolean
  actionItemsComplete: boolean
  anyUpvotedByMe: boolean
}

export interface CardGroupActionsProps {
  aggregates: CardGroupAggregates
  canUpvote: boolean
  votes?: number
  settings: BoardSettingsWithPermissions
  onMarkAllDiscussed: (e: React.MouseEvent<HTMLButtonElement>) => void
  onUpvote?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onOpenComments?: () => void
}

export interface CardGroupExpandedListProps {
  memberCards: Card[]
  groupId: string
  isDragEnabled: boolean
  currentUserId?: string
  onRemoveCard?: (cardId: string) => (e: React.MouseEvent) => void
}

export interface GroupActionItemProps {
  actionItem: ActionItem & { cardId: string }
}

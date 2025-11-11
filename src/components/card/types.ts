import type { ActionItem, ColumnType } from '@/types'

export interface CardProps {
  canEdit?: boolean
  column: ColumnType
  content: string
  createdBy?: string
  currentUserId?: string
  id: string
  isDiscussed?: boolean
  isUpvoted?: boolean
  upvotes?: number
  actionItems?: ActionItem[]
}

import type { ActionItem, Comment } from '@/types'

export interface CardProps {
  canEdit?: boolean
  column: string
  content: string
  createdBy?: string
  currentUserId?: string
  id: string
  isDiscussed?: boolean
  isUpvoted?: boolean
  upvotes?: number
  actionItems?: ActionItem[]
  comments?: Comment[]
  votes?: number
}

export type CardVotingProps = Pick<CardProps, 'id' | 'content' | 'upvotes'>

export type CardActionProps = {
  icon: React.ReactNode
  text: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  amount?: number
  textClasses?: string
  buttonClasses?: string
}

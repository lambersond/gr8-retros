import type { Comment } from '@/types'

export type CommentsState = {
  sidebarOpen: boolean
  cardId: string | undefined
  comments: Comment[]
}

export type CommentActionType = {
  ADD_COMMENT: 'ADD_COMMENT'
  REMOVE_COMMENT: 'REMOVE_COMMENT'
  UPDATE_COMMENT: 'UPDATE_COMMENT'
  REMOVE_ALL_COMMENTS: 'REMOVE_ALL_COMMENTS'
  FETCH_COMMENTS_FOR_CARD: 'FETCH_COMMENTS_FOR_CARD'
}

export type CommentsAction =
  | { type: CommentActionType['ADD_COMMENT']; payload: Comment }
  | { type: CommentActionType['REMOVE_COMMENT']; payload: { id: string } }
  | { type: CommentActionType['UPDATE_COMMENT']; payload: Comment }
  | { type: CommentActionType['REMOVE_ALL_COMMENTS'] }
  | {
      type: CommentActionType['FETCH_COMMENTS_FOR_CARD']
      payload: {
        cardId: string
        comments: Comment[]
      }
    }
  | {
      type: 'OPEN_SIDEBAR'
      payload: {
        cardId: string
        comments: Comment[]
      }
    }
  | { type: 'CLOSE_SIDEBAR' }

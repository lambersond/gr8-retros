'use client'

import {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react'
import { Comments } from './comments'
import { reducer } from './reducer'
import type { CommentsAction, CommentsState } from './types'
import type { Comment } from '@/types'

const CommentsCtx = createContext<CommentsState | undefined>(undefined)
const CommentsDispatchCtx = createContext<Dispatch<CommentsAction> | undefined>(
  undefined,
)

export function CommentsProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [state, dispatch] = useReducer(reducer, {
    comments: [] as Comment[],
    cardId: undefined,
    sidebarOpen: false,
  })

  return (
    <CommentsCtx.Provider value={state}>
      <CommentsDispatchCtx.Provider value={dispatch}>
        {children}
        <Comments />
      </CommentsDispatchCtx.Provider>
    </CommentsCtx.Provider>
  )
}

export function useComments() {
  const ctx = useContext(CommentsCtx)
  if (!ctx) {
    throw new Error('useComments must be used within CommentsProvider')
  }
  return ctx
}

export function useCommentsDispatch() {
  const ctx = useContext(CommentsDispatchCtx)
  if (!ctx) {
    throw new Error('useCommentsDispatch must be used within CommentsProvider')
  }
  return ctx
}

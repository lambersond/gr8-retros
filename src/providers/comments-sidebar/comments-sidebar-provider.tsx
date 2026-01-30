'use client'

import {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react'
import { reducer } from './reducer'
import type { CommentsSidebarAction, CommentsSidebarState } from './types'

const CommentsSidebarCtx = createContext<CommentsSidebarState | undefined>(
  undefined,
)
const CommentsSidebarDispatchCtx = createContext<
  Dispatch<CommentsSidebarAction> | undefined
>(undefined)

export function CommentsSidebarProvider({
  boardId,
  children,
}: Readonly<{
  boardId: string
  children: ReactNode
}>) {
  const [state, dispatch] = useReducer(reducer, {
    boardId,
    cardId: undefined,
    sidebarOpen: false,
  })

  return (
    <CommentsSidebarCtx.Provider value={state}>
      <CommentsSidebarDispatchCtx.Provider value={dispatch}>
        {children}
      </CommentsSidebarDispatchCtx.Provider>
    </CommentsSidebarCtx.Provider>
  )
}

export function useCommentsSidebar() {
  const ctx = useContext(CommentsSidebarCtx)
  if (!ctx) {
    throw new Error(
      'useCommentsSidebar must be used within CommentsSidebarProvider',
    )
  }
  return ctx
}

export function useCommentsSidebarDispatch() {
  const ctx = useContext(CommentsSidebarDispatchCtx)
  if (!ctx) {
    throw new Error(
      'useCommentsSidebarDispatch must be used within CommentsSidebarProvider',
    )
  }
  return ctx
}

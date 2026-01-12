'use client'

import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  isCacheValid,
  getRoleFromBoards,
  getSettingsIdFromBoards,
  checkHasRole,
  findBoardInCache,
} from './utils'
import { useAuth } from '@/hooks/use-auth'
import type { BoardMembershipContextType, BoardMembershipData } from './types'
import type { BoardRole } from '@/enums'

export const BoardMembershipContext = createContext<
  BoardMembershipContextType | undefined
>(undefined)

export function BoardMembershipProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isAuthenticated } = useAuth()
  const [boards, setBoards] = useState<BoardMembershipData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const lastFetch = useRef(0)
  const isFetchingRef = useRef(false)

  const fetchBoards = useCallback(
    async (force: boolean = false) => {
      if (!isAuthenticated) return
      if (isFetchingRef.current) return
      if (!force && isCacheValid(lastFetch.current)) return

      isFetchingRef.current = true
      setIsLoading(true)

      try {
        const response = await fetch('/api/me/boards')

        if (!response.ok) {
          throw new Error('Failed to fetch boards')
        }

        const data = await response.json()

        setBoards(data)
        lastFetch.current = Date.now()
      } catch (error) {
        console.error('Error fetching boards:', error)
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    },
    [isAuthenticated],
  )

  const clearCache = useCallback(() => {
    setBoards([])
    lastFetch.current = 0
  }, [])

  const contextValue = useMemo(
    () => ({
      boards,
      getRole: (boardId: string) => getRoleFromBoards(boards, boardId),
      getSettingsId: (boardId: string) =>
        getSettingsIdFromBoards(boards, boardId),
      hasRole: (boardId: string, minimumRole: BoardRole) =>
        checkHasRole(boards, boardId, minimumRole),
      isLoading,
      fetchBoards,
      ensureBoardInCache: async (
        boardId: string,
      ): Promise<BoardRole | undefined> => {
        const cached = findBoardInCache(boards, boardId)
        if (cached) return cached.role
        await fetchBoards(true)
        return findBoardInCache(boards, boardId)?.role
      },
      clearCache,
    }),
    [boards, isLoading, fetchBoards, clearCache],
  )

  useEffect(() => {
    if (isAuthenticated) {
      fetchBoards()
    }
  }, [isAuthenticated, fetchBoards])

  return (
    <BoardMembershipContext.Provider value={contextValue}>
      {children}
    </BoardMembershipContext.Provider>
  )
}

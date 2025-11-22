'use client'

import { useEffect, useState } from 'react'
import { useRetroBoard } from '../provider/retro-board-provider'
import type { ColumnType, Comment } from '@/types'

export function useCardComments(
  column: ColumnType | undefined,
  cardId: string | undefined,
) {
  const [comments, setComments] = useState<Comment[]>([])
  const state = useRetroBoard()

  useEffect(() => {
    if (!column || !cardId) {
      setComments([])
      return
    }

    const card = state[column].cards.find(c => c.id === cardId)
    if (card) {
      setComments(card.comments)
    }
  }, [state, column, cardId])

  return comments
}

'use client'

import { useEffect, useState } from 'react'
import { useBoardCards } from '@/providers/retro-board/cards'
import type { Comment } from '@/types'

export function useCardComments(cardId?: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const state = useBoardCards()

  useEffect(() => {
    if (!cardId) {
      setComments([])
      return
    }

    const card = state.cards[cardId]
    setComments(card?.comments ?? [])
  }, [state, cardId])

  return comments
}

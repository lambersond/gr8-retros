'use client'

import { useEffect, useState } from 'react'
import { useBoardCards } from '@/providers/retro-board/cards'
import type { Comment } from '@/types'

export type GroupComment = Comment & { cardContent: string }

export function useGroupComments(groupId?: string) {
  const [comments, setComments] = useState<GroupComment[]>([])
  const [memberCards, setMemberCards] = useState<
    { id: string; content: string }[]
  >([])
  const state = useBoardCards()

  useEffect(() => {
    if (!groupId) {
      setComments([])
      setMemberCards([])
      return
    }

    const group = state.groups[groupId]
    if (!group) {
      setComments([])
      setMemberCards([])
      return
    }

    const cards = group.cardIds.map(id => state.cards[id]).filter(Boolean)

    setMemberCards(cards.map(c => ({ id: c.id, content: c.content })))

    const allComments: GroupComment[] = cards.flatMap(card =>
      (card.comments ?? []).map(comment => ({
        ...comment,
        cardContent: card.content,
      })),
    )

    allComments.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    setComments(allComments)
  }, [state, groupId])

  return { comments, memberCards }
}

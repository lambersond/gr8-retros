'use server'

import * as repository from './card-repository'
import type {
  CreateCardParams,
  EditCardContentParams,
  MarkCardDiscussedParams,
} from '@/types'

export async function deleteCardById(cardId: string) {
  return repository.deleteCardById(cardId)
}

export async function deleteCardsByBoardId(boardId: string) {
  return repository.deleteCardsByBoardId(boardId)
}

export async function createCard(params: CreateCardParams) {
  return repository.createCard(params)
}

export async function editCardContent(params: EditCardContentParams) {
  return repository.editCardContent(params)
}

export async function markCardDiscussed(params: MarkCardDiscussedParams) {
  return repository.markCardDiscussed(params)
}

export async function upvoteCard(params: { cardId: string; userId: string }) {
  const foundCard = await repository.getCardById(params.cardId)

  if (!foundCard) throw new Error('Card not found')

  const hasUpvoted = foundCard.upvotedBy.includes(params.userId)

  const updatedUpvotedBy = hasUpvoted
    ? foundCard.upvotedBy.filter(u => u !== params.userId)
    : [...foundCard.upvotedBy, params.userId]

  return repository.upvoteCard({
    cardId: params.cardId,
    upvotedBy: updatedUpvotedBy,
  })
}

export async function deleteCompletedCardsByBoardId(boardId: string) {
  return repository.deleteCompletedCardsByBoardId(boardId)
}

'use server'

import * as repository from './card-repository'
import type {
  AddCardToGroupParams,
  CreateCardParams,
  EditCardContentParams,
  MarkCardDiscussedParams,
  RemoveCardFromGroupParams,
  UpdateCardPositionParams,
} from '@/types'

export async function deleteCardById(cardId: string) {
  return repository.deleteCardById(cardId)
}

export async function deleteCardsByBoardId(boardId: string) {
  return repository.deleteCardsByBoardId(boardId)
}

export async function deleteCardsByIds(cardIds: string[]) {
  return repository.deleteCardsByIds(cardIds)
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

export async function deleteCompletedCardsOlderThanNDays(days = 7) {
  return repository.deleteCompletedCardsOlderThanNDays(days)
}

export async function deleteCompletedCardsOlderThanNDaysByBoardId(
  boardId: string,
  days = 7,
) {
  return repository.deleteCompletedCardsOlderThanNDaysByBoardId(boardId, days)
}

export async function updateCardPosition(params: UpdateCardPositionParams) {
  return repository.updateCardPosition(params)
}

export async function addCardToGroup(params: AddCardToGroupParams) {
  const card = await repository.getCardById(params.cardId)
  if (!card) throw new Error('Card not found')
  if (card.cardGroupId === params.cardGroupId) return card
  return repository.addCardToGroup(params)
}

export async function removeCardFromGroup(params: RemoveCardFromGroupParams) {
  const card = await repository.getCardById(params.cardId)
  if (!card) throw new Error('Card not found')
  if (!card.cardGroupId) return card
  return repository.removeCardFromGroup(params)
}

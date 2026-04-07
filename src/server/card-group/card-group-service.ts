'use server'

import * as repository from './card-group-repository'
import * as cardRepository from '@/server/card/card-repository'
import type { CreateCardGroupParams, EditCardGroupParams } from '@/types'

export async function createCardGroup(params: CreateCardGroupParams) {
  const [card1, card2] = await Promise.all([
    cardRepository.getCardById(params.cardId1),
    cardRepository.getCardById(params.cardId2),
  ])

  if (!card1) throw new Error(`Card not found: ${params.cardId1}`)
  if (!card2) throw new Error(`Card not found: ${params.cardId2}`)

  if (
    card1.retroSessionId !== params.boardId ||
    card2.retroSessionId !== params.boardId
  ) {
    throw new Error('Cards must belong to the same board')
  }
  if (card1.cardGroupId ?? card2.cardGroupId) {
    throw new Error('Cards must not already be in a group')
  }

  return repository.createCardGroup(params)
}

export async function editCardGroup(params: EditCardGroupParams) {
  if (
    params.label === undefined &&
    params.position === undefined &&
    params.column === undefined
  ) {
    return repository.getCardGroupById(params.cardGroupId)
  }

  return repository.editCardGroup(params)
}

export async function deleteCardGroup(cardGroupId: string) {
  const group = await repository.getCardGroupById(cardGroupId)
  if (!group) throw new Error('Card group not found')

  if (group.cards.length <= 1) {
    return deleteEmptyCardGroup(cardGroupId)
  }

  return repository.deleteCardGroup(cardGroupId)
}

export async function deleteCardGroupsByIds(groupIds: string[]) {
  return repository.deleteCardGroupsByIds(groupIds)
}

export async function deleteEmptyCardGroup(cardGroupId: string) {
  const group = await repository.getCardGroupById(cardGroupId)
  if (!group) throw new Error('Card group not found')
  if (group.cards.length === 0) return repository.deleteCardGroup(cardGroupId)
  if (group.cards.length > 1) throw new Error('Card group is not empty')
  return repository.deleteEmptyCardGroup(cardGroupId)
}

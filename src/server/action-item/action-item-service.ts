'use server'

import * as repository from './action-item-repository'
import type { CreateActionItemParams } from '@/types'

export async function createActionItem(params: CreateActionItemParams) {
  const actionItem = await repository.createActionItem(params.item)
  return actionItem
}

export async function toggleDoneActionItem(
  actionItemId: string,
  isDone: boolean,
) {
  return repository.updateActionItem(actionItemId, { isDone })
}

export async function updateActionItemContent(params: {
  boardId: string
  cardId: string
  actionItemId: string
  patch: { content?: string; assignedToId?: string | null }
}) {
  const actionItem = await repository.updateActionItem(params.actionItemId, {
    content: params.patch.content,
    // eslint-disable-next-line unicorn/no-null
    assignedToId: params.patch.assignedToId ?? null,
  })

  return actionItem
}

export async function deleteActionItem(actionItemId: string) {
  const actionItem = await repository.deleteActionItem(actionItemId)
  return actionItem
}

export async function deleteOwnActionItem(
  actionItemId: string,
  userId: string,
) {
  const actionItem = await repository.deleteOwnActionItem(actionItemId, userId)
  return actionItem
}

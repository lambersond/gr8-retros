'use server'

import * as repository from './action-item-repository'
import { CARD_ACTION } from '@/constants/retro-board'
import { publishMessageToChannel } from '@/lib/ably'
import type { CreateActionItemParams } from '@/types'

export async function createActionItem(params: CreateActionItemParams) {
  const actionItem = await repository.createActionItem(params.item)
  publishMessageToChannel(params.boardId, {
    name: 'action-item-created',
    data: {
      type: CARD_ACTION.ADD_ACTION_ITEM,
      column: actionItem.card.column,
      payload: {
        cardId: actionItem.cardId,
        actionItem,
      },
    },
  })
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

  publishMessageToChannel(params.boardId, {
    name: 'action-item-updated',
    data: {
      type: CARD_ACTION.UPDATE_ACTION_ITEM,
      column: actionItem.card.column,
      payload: {
        cardId: actionItem.cardId,
        actionItemId: actionItem.id,
        patch: actionItem,
      },
    },
  })
  return actionItem
}

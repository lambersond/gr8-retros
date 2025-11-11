'use server'

import * as repository from './action-item-repository'
import { CreateActionItemParams } from '@/types'

export async function createActionItem(params: CreateActionItemParams) {
  return repository.createActionItem(params)
}

export async function toggleDoneActionItem(
  actionItemId: string,
  isDone: boolean,
) {
  return repository.updateActionItem(actionItemId, { isDone })
}

export async function updateActionItemContent(
  actionItemId: string,
  content: string,
) {
  return repository.updateActionItem(actionItemId, { content })
}

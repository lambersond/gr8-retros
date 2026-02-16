'use client'

import { Avatar } from '../avatar'
import { useCard } from '../card/use-card'
import { IconButton, Tooltip } from '../common'
import * as utils from './utils'
import { useBoardPermissions } from '@/providers/retro-board/board-settings'
import type { ActionItemsProps } from './types'

export function ActionItems({
  actionItems,
  cardId,
}: Readonly<ActionItemsProps>) {
  const cardActions = useCard({ cardId })
  const { userPermissions } = useBoardPermissions()
  const canManage = userPermissions['actionItems.restricted.canManage']

  if (actionItems.length === 0) {
    return
  }

  return (
    <div className='mt-2 flex flex-col gap-1 bg-orange-100 p-2'>
      <p className='font-semibold underline px-1'>Action Items</p>
      {actionItems.map(actionItem => (
        <div
          key={actionItem.id}
          className='flex items-start gap-1 pl-2 py-1 z-0'
        >
          {canManage && (
            <IconButton
              {...utils.getIconButtonProps(actionItem.isDone)}
              onClick={cardActions.handleToggleDoneActionItem(
                actionItem.id,
                !actionItem.isDone,
              )}
            />
          )}
          {actionItem.assignedTo && (
            <Tooltip title={actionItem.assignedTo.name}>
              <Avatar
                alt={actionItem.assignedTo.name}
                src={actionItem.assignedTo.image}
              />
            </Tooltip>
          )}
          <button
            onClick={cardActions.handleUpdateActionItem(
              actionItem.id,
              actionItem.content,
              actionItem.assignedTo?.id,
            )}
            disabled={!canManage}
            style={{ zIndex: -1 }}
            className={utils.getActionItemClassNames(
              actionItem.isDone,
              +!!actionItem.assignedTo + +canManage,
            )}
          >
            {actionItem.content}
          </button>
        </div>
      ))}
    </div>
  )
}

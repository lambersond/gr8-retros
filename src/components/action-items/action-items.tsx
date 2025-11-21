'use client'

import { useCard } from '../card/use-card'
import { IconButton } from '../common'
import * as utils from './utils'
import type { ActionItemsProps } from './types'

export function ActionItems({
  actionItems,
  cardId,
  column,
}: Readonly<ActionItemsProps>) {
  const cardActions = useCard({ column, cardId })

  if (actionItems.length === 0) {
    return
  }

  return (
    <div className='mt-2 flex flex-col gap-1 bg-orange-100 p-2'>
      <p className='font-semibold underline px-1'>Action Items</p>
      {actionItems.map(actionItem => (
        <div key={actionItem.id} className='flex items-start gap-2 pl-2 py-1'>
          <IconButton
            {...utils.getIconButtonProps(actionItem.isDone)}
            onClick={cardActions.handleToggleDoneActionItem(
              actionItem.id,
              !actionItem.isDone,
            )}
          />
          <button
            onClick={cardActions.handleUpdateActionItemContent(
              actionItem.id,
              actionItem.content,
            )}
            className={utils.getActionItemClassNames(actionItem.isDone)}
          >
            {actionItem.content}
          </button>
        </div>
      ))}
    </div>
  )
}

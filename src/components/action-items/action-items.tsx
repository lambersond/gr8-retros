'use client'

import Image from 'next/image'
import { useCard } from '../card/use-card'
import { IconButton, Tooltip } from '../common'
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
        <div
          key={actionItem.id}
          className='flex items-start gap-1 pl-2 py-1 z-0'
        >
          <IconButton
            {...utils.getIconButtonProps(actionItem.isDone)}
            onClick={cardActions.handleToggleDoneActionItem(
              actionItem.id,
              !actionItem.isDone,
            )}
          />
          {actionItem.assignedTo && (
            <Tooltip title={actionItem.assignedTo.name} asChild>
              <Image
                src={actionItem.assignedTo.image || '/no-image.png'}
                alt={actionItem.assignedTo.name}
                width={22}
                height={22}
                className='size-5.5 rounded-full mt-0.5'
              />
            </Tooltip>
          )}
          <button
            onClick={cardActions.handleUpdateActionItem(
              actionItem.id,
              actionItem.content,
              actionItem.assignedTo?.id,
            )}
            style={{ zIndex: -1 }}
            className={utils.getActionItemClassNames(
              actionItem.isDone,
              !!actionItem.assignedTo,
            )}
          >
            {actionItem.content}
          </button>
        </div>
      ))}
    </div>
  )
}

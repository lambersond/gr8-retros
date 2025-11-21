'use client'

import {
  ArrowBigUp,
  CircleAlert,
  CircleCheckBig,
  MessageSquarePlus,
  MessageSquareWarning,
  Pencil,
  Square,
  SquareCheckBig,
  Trash2,
} from 'lucide-react'
import { IconButton, Tooltip } from '../common'
import { DiscussedIcon } from '../common/icons'
import { useCard } from './use-card'
import * as cardUtils from './utils'
import type { CardProps } from './types'

export function Card({
  id,
  column,
  content,
  canEdit = false,
  upvotes = 0,
  isUpvoted = false,
  isDiscussed = false,
  createdBy = 'Anonymous',
  actionItems = [],
  currentUserId = 'temp-user-id',
}: Readonly<CardProps>) {
  const {
    handleAddActionItem,
    handleDelete,
    handleDiscussed,
    handleEdit,
    handleToggleDoneActionItem,
    handleUpdateActionItemContent,
    handleUpvote,
    openCommentsSidebar,
  } = useCard({
    column,
    cardId: id,
    currentUserId,
  })

  const upvoteTextClasses = cardUtils.upvoteTextClasses(isUpvoted, upvotes)
  const upvoteArrowButtonClasses = cardUtils.upvoteArrowButtonClasses(isUpvoted)
  const itemClasses = cardUtils.itemClasses(isDiscussed)
  const actionsItemsExist = actionItems.length > 0
  const actionsItemsComplete = actionItems.every(item => item.isDone)

  return (
    <div className='group p-2 border border-slate-200 rounded shadow flex flex-col gap-2 bg-page w-full hover:shadow-md transition-shadow hover:bg-page/80'>
      <div className='flex items-start gap-2'>
        <div className='flex flex-col items-center'>
          <button className={upvoteArrowButtonClasses} onClick={handleUpvote}>
            <ArrowBigUp className='size-5' />
          </button>
          <span className={upvoteTextClasses}>{upvotes}</span>
        </div>
        <p className={itemClasses}>{content}</p>
        {actionsItemsExist && (
          <div className='relative ml-auto min-w-fit'>
            {actionsItemsComplete ? (
              <Tooltip title='All action items completed'>
                <CircleCheckBig className='size-5 text-success right-0' />
              </Tooltip>
            ) : (
              <Tooltip title='Some action items pending'>
                <CircleAlert className='size-5 text-warning right-0' />
              </Tooltip>
            )}
          </div>
        )}
      </div>
      <div>
        {actionsItemsExist && (
          <div className='mt-2 flex flex-col gap-1 bg-orange-100 p-2'>
            <p className='font-semibold underline px-1'>Action Items:</p>
            {actionItems.map(actionItem => (
              <div
                key={actionItem.id}
                className='flex items-center gap-2 pl-2 py-1'
              >
                <IconButton
                  icon={actionItem.isDone ? SquareCheckBig : Square}
                  tooltip={actionItem.isDone ? 'Mark Undone' : 'Mark Done'}
                  intent={actionItem.isDone ? 'success' : 'primary'}
                  size='md'
                  onClick={handleToggleDoneActionItem(
                    actionItem.id,
                    !actionItem.isDone,
                  )}
                />
                <button
                  onClick={handleUpdateActionItemContent(
                    actionItem.id,
                    actionItem.content,
                  )}
                  className={
                    actionItem.isDone
                      ? 'line-through text-text-tertiary group-hover:no-underline'
                      : ''
                  }
                >
                  {actionItem.content}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div id='footer' className='flex items-center gap-2 justify-between'>
        <div className='flex items-center gap-1'>
          {!isDiscussed && (
            <IconButton
              icon={DiscussedIcon}
              tooltip='Mark Discussed'
              onClick={handleDiscussed(!isDiscussed)}
            />
          )}
          <IconButton
            icon={MessageSquareWarning}
            tooltip='Add Action Item'
            intent='warning'
            onClick={handleAddActionItem}
          />
          <div className='hidden'>
            <IconButton
              icon={MessageSquarePlus}
              tooltip='Add Comment'
              intent='primary'
              onClick={openCommentsSidebar}
            />
          </div>
          {canEdit && (
            <>
              <IconButton
                icon={Pencil}
                tooltip='Edit'
                onClick={handleEdit(content)}
              />
              <IconButton
                icon={Trash2}
                tooltip='Delete'
                intent='danger'
                onClick={handleDelete}
              />
            </>
          )}
        </div>
        <span className='text-xs text-text-tertiary italic'>{createdBy}</span>
      </div>
    </div>
  )
}

'use client'

import {
  ArrowBigUp,
  CircleAlert,
  CircleCheckBig,
  MessageSquareIcon,
  MessageSquareWarning,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react'
import { ActionItems } from '../action-items'
import { IconButton, Menu, Popover, Tooltip } from '../common'
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
  comments = [],
}: Readonly<CardProps>) {
  const {
    handleAddActionItem,
    handleDelete,
    handleDiscussed,
    handleEdit,
    handleUpvote,
    openCommentsSidebar,
  } = useCard({ column, cardId: id, currentUserId })

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
        <div className='flex gap-1 items-center'>
          {actionsItemsExist && (
            <div className='flex items-center'>
              {actionsItemsComplete ? (
                <Tooltip title='All action items completed'>
                  <CircleCheckBig className='size-5 text-success' />
                </Tooltip>
              ) : (
                <Tooltip title='Some action items pending'>
                  <CircleAlert className='size-5 text-warning' />
                </Tooltip>
              )}
            </div>
          )}
          {canEdit && (
            <Popover
              content={
                <Menu
                  options={[
                    {
                      label: 'Edit Title',
                      onClick: handleEdit(content),
                      icon: <Pencil size={18} />,
                    },
                    {
                      label: 'Delete Card',
                      onClick: handleDelete,
                      icon: <Trash2 size={18} />,
                      color: 'danger',
                    },
                  ]}
                />
              }
              placement='top-start'
            >
              <IconButton
                icon={MoreVertical}
                tooltip='Owner actions'
                size='md'
              />
            </Popover>
          )}
        </div>
      </div>
      <ActionItems actionItems={actionItems} cardId={id} column={column} />
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
          <div className='relative'>
            {comments.length > 0 && (
              <div id='comments-badge' className='absolute -top-1 -right-1'>
                {comments.length > 99 ? (
                  <div className='size-4 bg-info text-white text-xs rounded-full flex items-center justify-center px-0.75'>
                    99+
                  </div>
                ) : (
                  <div className='size-4 bg-info text-white text-xs rounded-full flex items-center justify-center px-0.5'>
                    {comments.length}
                  </div>
                )}
              </div>
            )}
            <IconButton
              icon={MessageSquareIcon}
              tooltip='Comments'
              onClick={openCommentsSidebar}
            />
          </div>
        </div>
        <span className='text-xs text-text-tertiary italic'>{createdBy}</span>
      </div>
    </div>
  )
}

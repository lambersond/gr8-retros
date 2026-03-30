'use client'

import clsx from 'classnames'
import {
  ArrowBigUp,
  CircleAlert,
  CircleCheckBig,
  MessageSquareIcon,
  MessageSquareWarning,
  Pencil,
  Trash2,
  Vote,
} from 'lucide-react'
import { ActionItems } from '../action-items'
import { IconButton, Tooltip } from '../common'
import { DiscussedIcon } from '../common/icons'
import { CardAction } from './card-action'
import { useCard } from './use-card'
import * as cardUtils from './utils'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import type { CardProps } from './types'

export function CardDefault({
  id,
  content,
  canEdit = false,
  upvotes = 0,
  isUpvoted = false,
  isDiscussed = false,
  createdBy = 'Anonymous',
  actionItems = [],
  currentUserId = 'temp-user-id',
  comments = [],
  votes,
}: Readonly<CardProps>) {
  const {
    handleAddActionItem,
    handleDelete,
    handleDiscussed,
    handleEdit,
    handleUpvote,
    openCommentsSidebar,
  } = useCard({ cardId: id, currentUserId })
  const { userPermissions } = useBoardPermissions()
  const { settings } = useBoardSettings()

  const canUpvote = userPermissions['upvoting.restricted.canUpvote']
  const canAddActionItem = userPermissions['actionItems.restricted.canAdd']

  const itemClasses = cardUtils.itemClasses(isDiscussed)
  const actionsItemsExist = actionItems.length > 0
  const actionsItemsComplete = actionItems.every(item => item.isDone)

  const upvoteAction = canUpvote ? handleUpvote : undefined

  return (
    <div className='relative group border border-slate-100 rounded-lg shadow-card flex flex-col bg-white w-full hover:shadow-card-hover transition-shadow'>
      <div className='flex items-start gap-2 p-2 pb-0'>
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
        </div>
      </div>
      <div id='card-actions' className='flex items-center py-1 px-2 gap-1'>
        {!isDiscussed && (
          <CardAction
            icon={<DiscussedIcon className='size-4 text-text-secondary' />}
            text='Discussed'
            onClick={handleDiscussed(!isDiscussed)}
            buttonClasses='bg-secondary/8 cursor-pointer'
            textClasses='text-text-secondary'
          />
        )}
        {settings.upvoting.enabled && (
          <CardAction
            amount={upvotes}
            icon={
              <ArrowBigUp
                className={clsx(
                  {
                    'text-success group-hover/action:text-warning': isUpvoted,
                    'text-text-tertiary group-hover/action:text-primary':
                      !isUpvoted && upvotes === 0,
                    'text-text-secondary group-hover/action:text-primary':
                      !isUpvoted && upvotes > 0,
                  },
                  'size-4 transition-colors',
                )}
              />
            }
            text={`Upvote${upvotes === 1 ? '' : 's'}`}
            onClick={upvoteAction}
            buttonClasses={clsx({
              'bg-transparent cursor-not-allowed': !canUpvote,
              'bg-success/10 hover:bg-success/20 cursor-pointer':
                canUpvote && isUpvoted,
              'bg-neutral-100 cursor-pointer': canUpvote && !isUpvoted,
            })}
          />
        )}
        {!!votes && (
          <CardAction
            icon={<Vote className='size-4 text-primary-new' />}
            text={`Vote${votes === 1 ? '' : 's'}`}
            amount={votes}
            buttonClasses='bg-primary-new/20'
            textClasses='text-primary-new'
          />
        )}
        {settings.actionItems.enabled && canAddActionItem && (
          <CardAction
            icon={<MessageSquareWarning className='size-4 text-ai-checkbox' />}
            text='Add Action Item'
            onClick={handleAddActionItem}
            buttonClasses='bg-ai-bg cursor-pointer'
            textClasses='text-ai-label'
          />
        )}
        {settings.comments.enabled && (
          <CardAction
            icon={<MessageSquareIcon className='size-4 text-text-secondary' />}
            text={`Comment${comments.length === 1 ? '' : 's'}`}
            amount={comments.length > 0 ? comments.length : undefined}
            onClick={openCommentsSidebar}
            buttonClasses='bg-secondary/8 cursor-pointer'
            textClasses='text-text-secondary'
          />
        )}
      </div>
      <ActionItems actionItems={actionItems} cardId={id} />
      <div
        id='footer'
        className='flex items-center gap-2 justify-between p-2 border-t border-slate-200'
      >
        <div className='flex items-center gap-1'>
          {canEdit && (
            <>
              <IconButton
                icon={Pencil}
                tooltip='Edit'
                onClick={handleEdit(content)}
                size='sm'
              />
              <IconButton
                icon={Trash2}
                tooltip='Delete'
                onClick={handleDelete}
                intent='danger'
                size='sm'
              />
            </>
          )}
        </div>
        <span className='text-xs text-text-tertiary italic'>{createdBy}</span>
      </div>
    </div>
  )
}

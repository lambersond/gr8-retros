'use client'

import { useCallback } from 'react'
import clsx from 'classnames'
import {
  ArrowBigUp,
  CircleAlert,
  CircleCheckBig,
  GripVertical,
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
  isMergeTarget = false,
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
  const isDragEnabled = settings.dragAndDrop.enabled

  const onDragStart = useCallback(
    (e: React.DragEvent) => {
      const target = e.currentTarget as HTMLElement
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', JSON.stringify({ id, kind: 'card' }))
      requestAnimationFrame(() => {
        target.classList.add('dragging')
        target.style.opacity = '0.25'
      })
    },
    [id],
  )

  const onDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.remove('dragging')
    target.style.opacity = ''
  }, [])

  const itemClasses = cardUtils.itemClasses(isDiscussed)
  const actionsItemsExist = actionItems.length > 0
  const actionsItemsComplete = actionItems.every(item => item.isDone)

  const upvoteAction = canUpvote ? handleUpvote : undefined

  return (
    <div
      draggable={isDragEnabled}
      data-id={id}
      data-kind='card'
      onDragStart={isDragEnabled ? onDragStart : undefined}
      onDragEnd={isDragEnabled ? onDragEnd : undefined}
      className={clsx(
        'relative group border rounded-lg shadow-card flex flex-col bg-card w-full hover:shadow-card-hover transition-all select-none',
        isDragEnabled && 'cursor-grab',
        isMergeTarget
          ? 'ring-2 ring-warning border-warning scale-[1.02]'
          : 'border-border-light',
      )}
    >
      <div className='flex items-start gap-2 p-2 pb-0'>
        {isDragEnabled && (
          <div className='shrink-0 mt-0.5 text-text-secondary/40 hover:text-text-secondary'>
            <GripVertical className='size-4' />
          </div>
        )}
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
            buttonClasses='bg-text-secondary/10 cursor-pointer'
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
                    'text-text-secondary group-hover/action:text-text-primary':
                      !isUpvoted,
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
              'bg-text-secondary/10 hover:bg-text-secondary/20 cursor-pointer':
                canUpvote && !isUpvoted,
            })}
          />
        )}
        {!!votes && (
          <CardAction
            icon={<Vote className='size-4 text-primary' />}
            text={`Vote${votes === 1 ? '' : 's'}`}
            amount={votes}
            buttonClasses='bg-primary/20'
            textClasses='text-primary'
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
            buttonClasses='bg-text-secondary/10 cursor-pointer'
            textClasses='text-text-secondary'
          />
        )}
      </div>
      <ActionItems actionItems={actionItems} cardId={id} />
      <div
        id='footer'
        className='flex items-center gap-2 justify-between p-2 border-t border-tertiary'
      >
        <div className='flex items-center gap-1'>
          {canEdit && (
            <>
              <IconButton
                icon={Pencil}
                intent='text-secondary'
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
        <span className='text-xs text-text-secondary italic'>{createdBy}</span>
      </div>
      {isMergeTarget && (
        <div className='px-2 pb-1 text-xs font-semibold text-warning tracking-wide'>
          + Stack
        </div>
      )}
    </div>
  )
}

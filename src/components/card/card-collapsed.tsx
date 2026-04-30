'use client'

import clsx from 'clsx'
import { ArrowBigUp, MessageSquareIcon, Pencil, Vote } from 'lucide-react'
import { IconButton } from '../common'
import { DiscussedIcon } from '../common/icons'
import { CardAction } from './card-action'
import { useCard } from './use-card'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import type { CardProps } from './types'

export function CardCollapsed({
  id,
  content,
  canEdit = false,
  upvotes = 0,
  isUpvoted = false,
  isDiscussed = false,
  createdBy = 'Anonymous',
  currentUserId = 'temp-user-id',
  comments = [],
  votes,
}: Readonly<CardProps>) {
  const { handleDiscussed, handleEdit, handleUpvote, openCommentsSidebar } =
    useCard({ cardId: id, currentUserId })
  const { userPermissions } = useBoardPermissions()
  const { settings } = useBoardSettings()

  const isFacilitatorMode = useBoardControlsState(
    s => s.boardControls.facilitatorMode.isActive,
  )
  const canUpvote = userPermissions['upvoting.restricted.canUpvote']
  const upvoteAction = canUpvote ? handleUpvote : undefined

  return (
    <div className='flex flex-col w-full'>
      <div className='flex items-start gap-2 p-2 pb-0'>
        <p
          className={clsx(
            'text-sm font-medium flex-1',
            isDiscussed
              ? 'text-text-secondary line-through'
              : 'text-text-primary',
          )}
        >
          {content}
        </p>
      </div>
      <div className='flex items-center py-1 px-2 gap-1'>
        {!isDiscussed && (
          <CardAction
            icon={<DiscussedIcon className='size-3.5 text-text-secondary' />}
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
                  'size-3.5 transition-colors',
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
            icon={<Vote className='size-3.5 text-primary' />}
            text={`Vote${votes === 1 ? '' : 's'}`}
            amount={votes}
            buttonClasses='bg-primary/20'
            textClasses='text-primary'
          />
        )}
        {settings.comments.enabled && (
          <CardAction
            icon={
              <MessageSquareIcon className='size-3.5 text-text-secondary' />
            }
            text={`Comment${comments.length === 1 ? '' : 's'}`}
            amount={comments.length > 0 ? comments.length : undefined}
            onClick={openCommentsSidebar}
            buttonClasses='bg-text-secondary/10 cursor-pointer'
            textClasses='text-text-secondary'
          />
        )}
      </div>
      <div className='flex items-center justify-between px-2 pb-1'>
        <div className='flex items-center gap-1'>
          {canEdit && !isFacilitatorMode && (
            <IconButton
              icon={Pencil}
              intent='text-secondary'
              tooltip='Edit'
              onClick={handleEdit(content)}
              size='sm'
            />
          )}
        </div>
        {settings.cardAuthoring.enabled && (
          <span className='text-xs text-text-secondary italic'>{createdBy}</span>
        )}
      </div>
    </div>
  )
}

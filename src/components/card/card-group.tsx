'use client'

import { useCallback, useMemo, useState } from 'react'
import { useChannel } from 'ably/react'
import clsx from 'clsx'
import {
  ArrowBigUp,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleCheckBig,
  GripVertical,
  MessageSquareIcon,
  Pencil,
  Vote,
  X,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import * as actionItemUtils from '../action-items/utils'
import { Avatar } from '../avatar'
import { IconButton, Tooltip } from '../common'
import { DiscussedIcon } from '../common/icons'
import { CardAction } from './card-action'
import { CardCollapsed } from './card-collapsed'
import { useCard } from './use-card'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import {
  BoardCardsMessageType,
  CardGroupState,
  useBoardCards,
  useBoardCardsDispatch,
} from '@/providers/retro-board/cards'
import { editCardGroup } from '@/server/card-group/card-group-service'
import type { ActionItem } from '@/types'

export interface CardGroupProps {
  group: CardGroupState
  currentUserId?: string
  isMergeTarget?: boolean
  onRemoveCard?: (groupId: string, cardId: string) => void
  votes?: number
}

export function CardGroup({
  group,
  currentUserId,
  isMergeTarget = false,
  onRemoveCard,
  votes,
}: Readonly<CardGroupProps>) {
  const [expanded, setExpanded] = useState(false)
  const { cards: allCards } = useBoardCards()
  const dispatch = useBoardCardsDispatch()
  const { settings } = useBoardSettings()
  const { userPermissions } = useBoardPermissions()
  const { openModal } = useModals()
  const { id: boardId } = useParams() satisfies { id: string }
  const { publish } = useChannel(boardId)

  const canUpvote = userPermissions['upvoting.restricted.canUpvote']
  const isDragEnabled = settings.dragAndDrop.enabled

  const onDragStart = useCallback(
    (e: React.DragEvent) => {
      const target = e.currentTarget as HTMLElement
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData(
        'text/plain',
        JSON.stringify({ id: group.id, kind: 'group' }),
      )
      requestAnimationFrame(() => {
        target.classList.add('dragging')
        target.style.opacity = '0.25'
      })
    },
    [group.id],
  )

  const onDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.remove('dragging')
    target.style.opacity = ''
  }, [])

  const memberCards = group.cardIds.map(id => allCards[id]).filter(Boolean)

  const aggregates = useMemo(() => {
    const totalUpvotes = memberCards.reduce(
      (sum, c) => sum + c.upvotedBy.length,
      0,
    )
    const totalComments = memberCards.reduce(
      (sum, c) => sum + c.comments.length,
      0,
    )
    const allDiscussed =
      memberCards.length > 0 && memberCards.every(c => c.isDiscussed)
    const allActionItems = memberCards.flatMap(c =>
      c.actionItems.map(ai => ({ ...ai, cardId: c.id })),
    )
    const actionItemsExist = allActionItems.length > 0
    const actionItemsComplete =
      actionItemsExist && allActionItems.every(ai => ai.isDone)
    const anyUpvotedByMe =
      !!currentUserId &&
      memberCards.some(c => c.upvotedBy.includes(currentUserId))

    return {
      totalUpvotes,
      totalComments,
      allDiscussed,
      allActionItems,
      actionItemsExist,
      actionItemsComplete,
      anyUpvotedByMe,
    }
  }, [memberCards, currentUserId])

  const handleMarkAllDiscussed = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      const undiscussed = memberCards.filter(c => !c.isDiscussed)
      await Promise.all(
        undiscussed.map(card =>
          fetch('/api/card/discussed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ cardId: card.id, isDiscussed: true }),
          }).then(resp => {
            if (resp.ok) {
              publish({
                data: {
                  type: BoardCardsMessageType.UPDATE_CARD,
                  payload: {
                    cardId: card.id,
                    patch: { isDiscussed: true },
                  },
                },
              })
            }
          }),
        ),
      )
    },
    [memberCards, publish],
  )

  const toggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => !prev)
  }, [])

  const handleRemoveCard = useCallback(
    (cardId: string) => (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemoveCard?.(group.id, cardId)
    },
    [group.id, onRemoveCard],
  )

  const handleEditGroup = useCallback(() => {
    openModal('EditCardGroupModal', {
      currentLabel: group.label,
      onSubmit: async (label: string) => {
        await editCardGroup({ cardGroupId: group.id, label })
        dispatch({
          type: BoardCardsMessageType.UPDATE_CARD_GROUP,
          groupId: group.id,
          patch: { label },
        })
        publish({
          data: {
            type: BoardCardsMessageType.UPDATE_CARD_GROUP,
            payload: { groupId: group.id, patch: { label } },
          },
        })
      },
    })
  }, [dispatch, group.id, group.label, openModal, publish])

  return (
    <summary
      draggable={isDragEnabled}
      data-id={group.id}
      data-kind='group'
      onDragStart={isDragEnabled ? onDragStart : undefined}
      onDragEnd={isDragEnabled ? onDragEnd : undefined}
      className={clsx(
        'retro-item relative border rounded-lg select-none transition-all',
        'bg-card shadow-card hover:shadow-card-hover',
        'border-border-light',
        isDragEnabled && 'cursor-grab',
        isMergeTarget && 'ring-2 ring-warning border-warning scale-[1.02]',
      )}
      style={{
        boxShadow: isMergeTarget
          ? undefined
          : '3px 3px 0 0 color-mix(in srgb, var(--color-card) 92%, black), 3px 3px 0 1px var(--color-border-light), 6px 6px 0 0 color-mix(in srgb, var(--color-card) 84%, black), 6px 6px 0 1px var(--color-border-light)',
      }}
      onMouseDown={e => {
        if ((e.target as HTMLElement).closest('[data-no-drag]')) {
          e.stopPropagation()
        }
      }}
    >
      <div className='flex items-start justify-between gap-2 p-3 pb-0'>
        {isDragEnabled && (
          <div className='shrink-0 mt-0.5 text-text-secondary/40 hover:text-text-secondary cursor-grab'>
            <GripVertical className='size-4' />
          </div>
        )}
        <span className='lg:text-lg xl:text-xl font-bold text-text-primary flex-1 truncate'>
          {group.label}
        </span>
        <div className='flex items-center gap-2 shrink-0'>
          {aggregates.actionItemsExist && (
            <div className='flex items-center'>
              {aggregates.actionItemsComplete ? (
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
          <span className='text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full'>
            ×{memberCards.length}
          </span>
          <button
            data-no-drag
            className='text-text-secondary hover:text-text-primary transition-colors cursor-pointer'
            onMouseDown={e => e.stopPropagation()}
            onClick={toggleExpand}
          >
            {expanded ? (
              <ChevronUp className='size-4' />
            ) : (
              <ChevronDown className='size-4' />
            )}
          </button>
        </div>
      </div>

      {!expanded && (
        <div className='flex items-center py-1 px-3 gap-1'>
          {!aggregates.allDiscussed && (
            <CardAction
              icon={<DiscussedIcon className='size-4 text-text-secondary' />}
              text='Discussed'
              onClick={handleMarkAllDiscussed}
              buttonClasses='bg-text-secondary/10 cursor-pointer'
              textClasses='text-text-secondary'
            />
          )}
          {settings.upvoting.enabled && (
            <CardAction
              amount={aggregates.totalUpvotes}
              icon={
                <ArrowBigUp
                  className={clsx('size-4 transition-colors', {
                    'text-success group-hover/action:text-warning':
                      aggregates.anyUpvotedByMe,
                    'text-text-secondary group-hover/action:text-text-primary':
                      !aggregates.anyUpvotedByMe && canUpvote,
                    'text-text-secondary':
                      !aggregates.anyUpvotedByMe && !canUpvote,
                  })}
                />
              }
              text={`Upvote${aggregates.totalUpvotes === 1 ? '' : 's'}`}
              buttonClasses={clsx({
                'bg-transparent cursor-not-allowed': !canUpvote,
                'bg-success/10 hover:bg-success/20 cursor-pointer':
                  canUpvote && aggregates.anyUpvotedByMe,
                'bg-text-secondary/10 hover:bg-text-secondary/20 cursor-pointer':
                  canUpvote && !aggregates.anyUpvotedByMe,
              })}
            />
          )}
          {!!votes && (
            <CardAction
              icon={<Vote className='size-4 text-primary' />}
              text={`Vote${votes === 1 ? '' : 's'}`}
              amount={votes}
              buttonClasses='bg-primary/10'
              textClasses='text-primary'
            />
          )}
          {settings.comments.enabled && (
            <CardAction
              amount={aggregates.totalComments}
              icon={
                <MessageSquareIcon className='size-4 text-text-secondary' />
              }
              text={`Comment${aggregates.totalComments === 1 ? '' : 's'}`}
              buttonClasses='bg-text-secondary/10'
              textClasses='text-text-secondary'
            />
          )}
        </div>
      )}

      {aggregates.allActionItems.length > 0 && (
        <div className='mt-2 flex flex-col gap-1 bg-ai-bg p-2 border-t border-ai-border rounded-b'>
          <p className='list-disc uppercase font-bold tracking-wide text-ai-label text-xs px-2'>
            Action Items
          </p>
          {aggregates.allActionItems.map(ai => (
            <GroupActionItem key={ai.id} actionItem={ai} />
          ))}
        </div>
      )}

      {expanded && (
        <div className='mt-3 border-t border-border-light pt-3 px-3 pb-3 flex flex-col gap-1'>
          {memberCards.map(card => (
            <summary
              key={card.id}
              draggable={isDragEnabled}
              onDragStart={
                isDragEnabled
                  ? e => {
                      e.stopPropagation()
                      const target = e.currentTarget as HTMLElement
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData(
                        'text/plain',
                        JSON.stringify({
                          id: card.id,
                          kind: 'card',
                          fromGroupId: group.id,
                        }),
                      )
                      requestAnimationFrame(() => {
                        target.classList.add('dragging')
                        target.style.opacity = '0.25'
                      })
                    }
                  : undefined
              }
              onDragEnd={
                isDragEnabled
                  ? e => {
                      const target = e.currentTarget as HTMLElement
                      target.classList.remove('dragging')
                      target.style.opacity = ''
                    }
                  : undefined
              }
              className={clsx(
                'flex items-start border border-border-light rounded-md bg-card',
                isDragEnabled && 'cursor-grab',
              )}
            >
              <div className='flex-1 min-w-0'>
                <CardCollapsed
                  id={card.id}
                  content={card.content}
                  column={card.column}
                  canEdit={card.creatorId === currentUserId}
                  upvotes={card.upvotedBy.length}
                  isUpvoted={card.upvotedBy.includes(currentUserId ?? '')}
                  isDiscussed={card.isDiscussed}
                  createdBy={card.createdBy}
                  currentUserId={currentUserId}
                  comments={card.comments}
                />
              </div>
              {onRemoveCard && (
                <button
                  data-no-drag
                  className='shrink-0 mt-2 mr-1 text-text-secondary hover:text-danger transition-colors cursor-pointer'
                  title='Remove from group'
                  onMouseDown={e => e.stopPropagation()}
                  onClick={handleRemoveCard(card.id)}
                >
                  <X className='size-4' />
                </button>
              )}
            </summary>
          ))}
        </div>
      )}

      <div className='flex items-center px-3 pb-2 pt-1'>
        <IconButton
          icon={Pencil}
          intent='text-secondary'
          tooltip='Edit group name'
          onClick={handleEditGroup}
          size='sm'
          data-no-drag
        />
      </div>

      {isMergeTarget && (
        <div className='px-3 pb-1 text-xs font-semibold text-warning tracking-wide'>
          + Stack
        </div>
      )}
    </summary>
  )
}

function GroupActionItem({ actionItem }: Readonly<{ actionItem: ActionItem }>) {
  const cardActions = useCard({ cardId: actionItem.cardId })
  const { userPermissions } = useBoardPermissions()
  const canManage = userPermissions['actionItems.restricted.canManage']

  return (
    <div className='flex items-start gap-1 pl-2 z-0'>
      {canManage && (
        <IconButton
          {...actionItemUtils.getIconButtonProps(actionItem.isDone)}
          intent='custom'
          className='text-ai-checkbox hover:bg-ai-checkbox/10'
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
        className={actionItemUtils.getActionItemClassNames(
          actionItem.isDone,
          +!!actionItem.assignedTo + +canManage,
        )}
      >
        {actionItem.content}
      </button>
    </div>
  )
}

'use client'

import { useCallback, useMemo, useState } from 'react'
import { useChannel } from 'ably/react'
import clsx from 'clsx'
import {
  CircleAlert,
  CircleCheckBig,
  GripVertical,
  Loader2,
  Pencil,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { IconButton, Tooltip } from '../../common'
import { CardGroupActions } from './card-group-actions'
import { CardGroupExpandedList } from './card-group-expanded-list'
import { GroupActionItem } from './group-action-item'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import {
  BoardCardsMessageType,
  useBoardCards,
  useBoardCardsDispatch,
} from '@/providers/retro-board/cards'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import { editCardGroup } from '@/server/card-group/card-group-service'
import type { CardGroupAggregates, CardGroupProps } from './types'

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

  const isFacilitatorMode = useBoardControlsState(
    s => s.boardControls.facilitatorMode.isActive,
  )
  const canUpvote = userPermissions['upvoting.restricted.canUpvote']
  const isDragEnabled = settings.dragAndDrop.enabled && !isFacilitatorMode

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

  const aggregates: CardGroupAggregates = useMemo(() => {
    const totalUpvotes = memberCards.reduce(
      (sum, c) => sum + (c.upvotedBy?.length ?? 0),
      0,
    )
    const totalComments = memberCards.reduce(
      (sum, c) => sum + (c.comments?.length ?? 0),
      0,
    )
    const allDiscussed =
      memberCards.length > 0 && memberCards.every(c => c.isDiscussed)
    const allActionItems = memberCards.flatMap(c =>
      (c.actionItems ?? []).map(ai => ({ ...ai, cardId: c.id })),
    )
    const actionItemsExist = allActionItems.length > 0
    const actionItemsComplete =
      actionItemsExist && allActionItems.every(ai => ai.isDone)
    const anyUpvotedByMe =
      !!currentUserId &&
      memberCards.some(c => c.upvotedBy?.includes(currentUserId))

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
        boxShadow:
          isMergeTarget || isFacilitatorMode
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
        {group.isGeneratingLabel ? (
          <span className='flex items-center gap-2 flex-1 text-text-secondary'>
            <Loader2 className='size-4 animate-spin' />
            <span className='text-sm italic'>Generating label…</span>
          </span>
        ) : (
          <button
            data-no-drag
            className={clsx(
              'lg:text-lg xl:text-xl font-bold flex-1 text-left cursor-pointer',
              aggregates.allDiscussed
                ? 'text-text-secondary line-through'
                : 'text-text-primary',
            )}
            onMouseDown={e => e.stopPropagation()}
            onClick={toggleExpand}
          >
            {group.label}
          </button>
        )}
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
        </div>
      </div>

      {!expanded && (
        <CardGroupActions
          aggregates={aggregates}
          canUpvote={canUpvote}
          votes={votes}
          settings={settings}
          onMarkAllDiscussed={handleMarkAllDiscussed}
        />
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
        <CardGroupExpandedList
          memberCards={memberCards}
          groupId={group.id}
          isDragEnabled={isDragEnabled}
          currentUserId={currentUserId}
          onRemoveCard={onRemoveCard ? handleRemoveCard : undefined}
        />
      )}

      {!isFacilitatorMode && (
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
      )}

      {isMergeTarget && (
        <div className='px-3 pb-1 text-xs font-semibold text-warning tracking-wide'>
          + Stack
        </div>
      )}
    </summary>
  )
}

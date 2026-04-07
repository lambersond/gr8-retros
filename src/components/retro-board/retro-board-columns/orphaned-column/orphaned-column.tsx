'use client'

import { useCallback } from 'react'
import { useChannel } from 'ably/react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Card, CardGroup } from '@/components/card'
import { IconButton } from '@/components/common'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  BoardCardsMessageType,
  type CardGroupState,
  useBoardCardsDispatch,
} from '@/providers/retro-board/cards'
import { deleteCardsByIds } from '@/server/card/card-service'
import { deleteCardGroupsByIds } from '@/server/card-group/card-group-service'
import type { Card as CardType } from '@/types'

type OrphanedItem =
  | { kind: 'card'; data: CardType }
  | { kind: 'group'; data: CardGroupState }

const ORPHANED_COLORS = {
  light: {
    bg: '#fef3c7',
    border: '#f59e0b',
    titleBg: '#fde68a',
    titleText: '#92400e',
    subtitleText: '#92400e',
  },
  dark: {
    bg: '#422006',
    border: '#b45309',
    titleBg: '#78350f',
    titleText: '#fde68a',
    subtitleText: '#fcd34d',
  },
}

export function OrphanedColumn({
  items,
}: Readonly<{
  items: OrphanedItem[]
}>) {
  const { id: boardId } = useParams() satisfies { id: string }
  const { publish } = useChannel(boardId)
  const dispatch = useBoardCardsDispatch()
  const { openModal } = useModals()
  const { user } = useAuth()
  const { resolvedTheme } = useTheme()
  const colors =
    resolvedTheme === 'dark' ? ORPHANED_COLORS.dark : ORPHANED_COLORS.light

  const handleRemoveAll = useCallback(() => {
    const cardIds = items
      .filter(
        (i): i is Extract<OrphanedItem, { kind: 'card' }> => i.kind === 'card',
      )
      .map(i => i.data.id)
    const groupIds = items
      .filter(
        (i): i is Extract<OrphanedItem, { kind: 'group' }> =>
          i.kind === 'group',
      )
      .map(i => i.data.id)

    // Also collect cards inside orphaned groups
    const groupCardIds = items
      .filter(
        (i): i is Extract<OrphanedItem, { kind: 'group' }> =>
          i.kind === 'group',
      )
      .flatMap(i => i.data.cardIds)

    const allCardIds = [...cardIds, ...groupCardIds]

    openModal('ConfirmModal', {
      title: 'Remove Orphaned Cards',
      color: 'danger',
      message: `This will permanently remove ${allCardIds.length} card${allCardIds.length === 1 ? '' : 's'} that no longer belong to any column.`,
      confirmButtonText: 'Yes, remove all',
      onConfirm: async () => {
        if (groupIds.length > 0) {
          await deleteCardGroupsByIds(groupIds)
        }
        if (allCardIds.length > 0) {
          await deleteCardsByIds(allCardIds)
        }

        dispatch({
          type: BoardCardsMessageType.DELETE_ORPHANED_CARDS,
          cardIds: allCardIds,
          groupIds,
        })
        publish({
          data: {
            type: BoardCardsMessageType.DELETE_ORPHANED_CARDS,
            payload: { cardIds: allCardIds, groupIds },
          },
        })
      },
    })
  }, [items, dispatch, publish, openModal])

  return (
    <div
      className='flex flex-col min-h-0 h-full rounded-lg border-2 relative'
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div
        className='flex items-center justify-between p-3 rounded-t-md max-h-13'
        style={{ backgroundColor: colors.titleBg, color: colors.titleText }}
      >
        <p className='text-xl tracking-tight font-semibold flex items-center gap-2'>
          <AlertTriangle className='size-5' />
          Orphaned Cards
        </p>
        <IconButton
          icon={Trash2}
          tooltip='Remove all orphaned cards'
          size='xl'
          intent='danger'
          onClick={handleRemoveAll}
        />
      </div>
      <p
        className='px-3 pt-2 pb-1 text-xs'
        style={{ color: colors.subtitleText }}
      >
        These cards belong to columns that no longer exist. Drag them to a
        column or remove them.
      </p>
      <div className='flex-1 min-h-0 flex flex-col gap-3 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700/10 scrollbar-track-transparent'>
        {items.map(item => (
          <div key={`${item.kind}-${item.data.id}`}>
            {item.kind === 'card' && (
              <Card
                canEdit={item.data.creatorId === user?.id}
                upvotes={item.data.upvotedBy.length}
                isUpvoted={item.data.upvotedBy.includes(user?.id ?? '')}
                column={item.data.column}
                id={item.data.id}
                currentUserId={user?.id}
                isDiscussed={item.data.isDiscussed}
                createdBy={item.data.createdBy}
                content={item.data.content}
                actionItems={item.data.actionItems}
                comments={item.data.comments}
              />
            )}
            {item.kind === 'group' && (
              <CardGroup group={item.data} currentUserId={user?.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

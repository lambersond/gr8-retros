'use client'

import { useCallback, useRef, useState } from 'react'
import { useChannel } from 'ably/react'
import { useParams } from 'next/navigation'
import { useModals } from '@/hooks/use-modals'
import { useBoardSettings } from '@/providers/retro-board/board-settings'
import {
  BoardCardsMessageType,
  useBoardCards,
  useBoardCardsDispatch,
  type CardGroupState,
} from '@/providers/retro-board/cards'
import { generateGroupLabel } from '@/server/ai/generate-group-label'
import {
  addCardToGroup,
  removeCardFromGroup,
  updateCardPosition,
} from '@/server/card/card-service'
import {
  createCardGroup,
  deleteCardGroup,
  editCardGroup,
} from '@/server/card-group/card-group-service'

type DropZone =
  | { type: 'insert'; index: number }
  | { type: 'merge'; targetId: string }

export type DropState =
  | { type: 'insert'; colId: string; index: number }
  | { type: 'merge'; colId: string; targetId: string }
  | null

interface CachedItemRect {
  id: string
  top: number
  bottom: number
  height: number
}

function snapshotItemRects(bodyEl: HTMLElement) {
  const elements = bodyEl.querySelectorAll<HTMLElement>('[data-id]')
  const rects: CachedItemRect[] = []
  let draggingFullIndex = -1
  let fullIndex = 0

  for (const el of elements) {
    if (el.classList.contains('dragging')) {
      draggingFullIndex = fullIndex
    } else {
      const r = el.getBoundingClientRect()
      rects.push({
        id: el.dataset.id!,
        top: r.top,
        bottom: r.bottom,
        height: r.height,
      })
    }
    fullIndex++
  }

  return { rects, draggingFullIndex }
}

/**
 * Maps an index in the non-dragging rects array back to the
 * corresponding index in the full items array (which includes
 * the dragging element the rects array skips).
 */
function toFullIndex(
  nonDraggingIndex: number,
  draggingFullIndex: number,
): number {
  if (draggingFullIndex === -1) return nonDraggingIndex
  return nonDraggingIndex >= draggingFullIndex
    ? nonDraggingIndex + 1
    : nonDraggingIndex
}

function getDropZoneFromRects(
  clientY: number,
  rects: CachedItemRect[],
): DropZone {
  for (const [i, r] of rects.entries()) {
    if (clientY < r.top) return { type: 'insert', index: i }
    if (clientY > r.bottom) continue

    const rel = (clientY - r.top) / r.height

    if (rel < 0.28) return { type: 'insert', index: i }
    if (rel <= 0.72) return { type: 'merge', targetId: r.id }
    return { type: 'insert', index: i + 1 }
  }

  return { type: 'insert', index: rects.length }
}

function mergeZoneToInsertIndex(
  rects: CachedItemRect[],
  targetId: string,
): number {
  const idx = rects.findIndex(r => r.id === targetId)
  return idx === -1 ? rects.length : idx + 1
}

function isDropStateEqual(
  prev: DropState | undefined,
  next: DropState,
): boolean {
  if (!prev || !next) return !prev && !next
  if (prev.type !== next.type || prev.colId !== next.colId) return false
  if (next.type === 'insert') {
    return (prev as Extract<DropState, { type: 'insert' }>).index === next.index
  }
  return (
    (prev as Extract<DropState, { type: 'merge' }>).targetId === next.targetId
  )
}

export function useColumnDragDrop(columnType: string) {
  const { id: boardId } = useParams() satisfies { id: string }
  const { publish } = useChannel(boardId)
  const dispatch = useBoardCardsDispatch()
  const boardCards = useBoardCards()

  const { openModal } = useModals()
  const { settings } = useBoardSettings()
  const groupingEnabled = settings.dragAndDrop.subsettings.grouping.enabled
  const aiNamingEnabled = settings.dragAndDrop.subsettings.aiNaming.enabled
  const [dropState, setDropState] = useState<DropState>()
  const bodyRef = useRef<HTMLDivElement | null>(null)

  // --- Broadcast helpers ---

  const broadcastAddToGroup = async (cardId: string, groupId: string) => {
    await addCardToGroup({ cardId, cardGroupId: groupId })
    dispatch({
      type: BoardCardsMessageType.ADD_CARD_TO_GROUP,
      cardId,
      groupId,
    })
    publish({
      data: {
        type: BoardCardsMessageType.ADD_CARD_TO_GROUP,
        payload: { cardId, groupId },
      },
    })
  }

  const broadcastGroupCreate = (
    group: CardGroupState,
    cardIds: [string, string],
  ) => {
    dispatch({
      type: BoardCardsMessageType.CREATE_CARD_GROUP,
      group,
      cardIds,
    })
    publish({
      data: {
        type: BoardCardsMessageType.CREATE_CARD_GROUP,
        payload: { group, cardIds },
      },
    })
  }

  const broadcastGroupPatch = (
    groupId: string,
    patch: Record<string, unknown>,
  ) => {
    dispatch({
      type: BoardCardsMessageType.UPDATE_CARD_GROUP,
      groupId,
      patch,
    })
    publish({
      data: {
        type: BoardCardsMessageType.UPDATE_CARD_GROUP,
        payload: { groupId, patch },
      },
    })
  }

  // --- Drag event handlers ---

  const handleDragStart = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    const id = target.dataset.id
    const kind = target.dataset.kind ?? 'card'
    if (!id) return

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, kind }))

    requestAnimationFrame(() => {
      target.classList.add('dragging')
      target.style.opacity = '0.25'
    })
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.remove('dragging')
    target.style.opacity = ''
    setDropState(undefined)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      const body = bodyRef.current
      if (!body) return

      const { rects, draggingFullIndex } = snapshotItemRects(body)
      const rawZone = getDropZoneFromRects(e.clientY, rects)
      const zone: DropZone =
        !groupingEnabled && rawZone.type === 'merge'
          ? {
              type: 'insert',
              index: mergeZoneToInsertIndex(rects, rawZone.targetId),
            }
          : rawZone

      const next: DropState =
        zone.type === 'insert'
          ? {
              type: 'insert',
              colId: columnType,
              index: toFullIndex(zone.index, draggingFullIndex),
            }
          : { type: 'merge', colId: columnType, targetId: zone.targetId }

      setDropState(prev => (isDropStateEqual(prev, next) ? prev : next))
    },
    [columnType, groupingEnabled],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      const col = e.currentTarget as HTMLElement
      if (!col.contains(e.relatedTarget as Node)) {
        setDropState(prev => (prev?.colId === columnType ? undefined : prev))
      }
    },
    [columnType],
  )

  // --- Group manipulation ---

  const detachFromGroup = async (cardId: string, groupId: string) => {
    const group = boardCards.groups[groupId]
    if (!group) return

    if (group.cardIds.length <= 2) {
      await deleteCardGroup(groupId)
      const remaining = group.cardIds.filter(id => id !== cardId)
      const restoredCards = remaining.map((id, i) => ({
        cardId: id,
        position: group.position + i,
      }))
      dispatch({
        type: BoardCardsMessageType.DELETE_CARD_GROUP,
        groupId,
        restoredCards,
      })
      publish({
        data: {
          type: BoardCardsMessageType.DELETE_CARD_GROUP,
          payload: { groupId, restoredCards },
        },
      })
    } else {
      await removeCardFromGroup({ cardId })
      dispatch({
        type: BoardCardsMessageType.REMOVE_CARD_FROM_GROUP,
        cardId,
        groupId,
        position: 0,
      })
      publish({
        data: {
          type: BoardCardsMessageType.REMOVE_CARD_FROM_GROUP,
          payload: { cardId, groupId, position: 0 },
        },
      })
    }
  }

  // --- Merge sub-handlers ---

  const mergeCardIntoGroup = async (
    srcId: string,
    targetGroup: CardGroupState,
  ) => {
    await broadcastAddToGroup(srcId, targetGroup.id)

    if (!aiNamingEnabled) return

    dispatch({
      type: BoardCardsMessageType.UPDATE_CARD_GROUP,
      groupId: targetGroup.id,
      patch: { isGeneratingLabel: true },
    })
    const allCardIds = [...targetGroup.cardIds, srcId]
    const contents = allCardIds
      .map(id => boardCards.cards[id]?.content)
      .filter(Boolean)
    const label = await generateGroupLabel(contents)
    if (label) {
      await editCardGroup({ cardGroupId: targetGroup.id, label })
      broadcastGroupPatch(targetGroup.id, { label, isGeneratingLabel: false })
    } else {
      dispatch({
        type: BoardCardsMessageType.UPDATE_CARD_GROUP,
        groupId: targetGroup.id,
        patch: { isGeneratingLabel: false },
      })
    }
  }

  const createGroupFromCards = async (
    srcId: string,
    srcContent: string,
    targetId: string,
    targetPosition: number,
    targetContent: string,
  ) => {
    if (!aiNamingEnabled) {
      openModal('CreateCardGroupModal', {
        onSubmit: async (label: string) => {
          const result = await createCardGroup({
            boardId,
            column: columnType,
            label,
            cardId1: targetId,
            cardId2: srcId,
            position: targetPosition,
          })
          if (!result) return
          broadcastGroupCreate(
            {
              id: result.id,
              label: result.label,
              column: result.column,
              position: result.position,
              retroSessionId: result.retroSessionId,
              createdAt: result.createdAt,
              updatedAt: result.updatedAt,
              cardIds: [targetId, srcId],
            },
            [targetId, srcId],
          )
        },
      })
      return
    }

    const result = await createCardGroup({
      boardId,
      column: columnType,
      label: '',
      cardId1: targetId,
      cardId2: srcId,
      position: targetPosition,
    })
    if (!result) return

    broadcastGroupCreate(
      {
        id: result.id,
        label: result.label,
        column: result.column,
        position: result.position,
        retroSessionId: result.retroSessionId,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        cardIds: [targetId, srcId],
        isGeneratingLabel: true,
      },
      [targetId, srcId],
    )

    const label =
      (await generateGroupLabel([targetContent, srcContent])) ?? 'Grouped Cards'
    await editCardGroup({ cardGroupId: result.id, label })
    broadcastGroupPatch(result.id, { label, isGeneratingLabel: false })
  }

  const mergeGroupOntoCard = async (
    srcGroup: CardGroupState,
    targetId: string,
    targetPosition: number,
  ) => {
    await broadcastAddToGroup(targetId, srcGroup.id)

    const newPosition = targetPosition ?? 1
    await editCardGroup({
      cardGroupId: srcGroup.id,
      position: newPosition,
      column: columnType,
    })
    dispatch({
      type: BoardCardsMessageType.UPDATE_GROUP_POSITION,
      groupId: srcGroup.id,
      position: newPosition,
      column: columnType,
    })
    publish({
      data: {
        type: BoardCardsMessageType.UPDATE_GROUP_POSITION,
        payload: {
          groupId: srcGroup.id,
          position: newPosition,
          column: columnType,
        },
      },
    })
  }

  const mergeTwoGroups = async (
    srcGroup: CardGroupState,
    targetGroup: CardGroupState,
  ) => {
    const performMerge = async (label: string) => {
      await Promise.all(
        srcGroup.cardIds.map(cardId =>
          broadcastAddToGroup(cardId, targetGroup.id),
        ),
      )
      await deleteCardGroup(srcGroup.id)
      dispatch({
        type: BoardCardsMessageType.DELETE_CARD_GROUP,
        groupId: srcGroup.id,
        restoredCards: [],
      })
      publish({
        data: {
          type: BoardCardsMessageType.DELETE_CARD_GROUP,
          payload: { groupId: srcGroup.id, restoredCards: [] },
        },
      })
      await editCardGroup({ cardGroupId: targetGroup.id, label })
      broadcastGroupPatch(targetGroup.id, { label })
    }

    if (!aiNamingEnabled) {
      openModal('CreateCardGroupModal', { onSubmit: performMerge })
      return
    }

    dispatch({
      type: BoardCardsMessageType.UPDATE_CARD_GROUP,
      groupId: targetGroup.id,
      patch: { isGeneratingLabel: true },
    })
    const allCardIds = [...targetGroup.cardIds, ...srcGroup.cardIds]
    const contents = allCardIds
      .map(id => boardCards.cards[id]?.content)
      .filter(Boolean)
    const label = (await generateGroupLabel(contents)) ?? 'Grouped Cards'
    await performMerge(label)
    dispatch({
      type: BoardCardsMessageType.UPDATE_CARD_GROUP,
      groupId: targetGroup.id,
      patch: { isGeneratingLabel: false },
    })
  }

  // --- Main merge dispatcher ---

  const handleMerge = async (
    srcId: string,
    srcKind: string,
    targetId: string,
    fromGroupId?: string,
  ) => {
    if (srcKind === 'card') {
      const srcCard = boardCards.cards[srcId]
      if (!srcCard) return
      if (fromGroupId) await detachFromGroup(srcId, fromGroupId)

      const targetGroup = boardCards.groups[targetId]
      if (targetGroup) return mergeCardIntoGroup(srcId, targetGroup)

      const targetCard = boardCards.cards[targetId]
      if (targetCard) {
        return createGroupFromCards(
          srcId,
          srcCard.content,
          targetId,
          targetCard.position ?? 0,
          targetCard.content,
        )
      }
      return
    }

    const srcGroup = boardCards.groups[srcId]
    if (!srcGroup) return

    const targetCard = boardCards.cards[targetId]
    if (targetCard) {
      return mergeGroupOntoCard(srcGroup, targetId, targetCard.position ?? 0)
    }

    const targetGroup = boardCards.groups[targetId]
    if (targetGroup) return mergeTwoGroups(srcGroup, targetGroup)
  }

  // --- Drop + Reorder ---

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setDropState(undefined)

      let dragData: { id: string; kind: string; fromGroupId?: string }
      try {
        dragData = JSON.parse(e.dataTransfer.getData('text/plain'))
      } catch {
        return
      }

      const { id: dragId, kind: dragKind, fromGroupId } = dragData
      const body = bodyRef.current
      const { rects, draggingFullIndex } = body
        ? snapshotItemRects(body)
        : { rects: [] as CachedItemRect[], draggingFullIndex: -1 }
      const rawZone =
        rects.length > 0
          ? getDropZoneFromRects(e.clientY, rects)
          : { type: 'insert' as const, index: 0 }

      if (rawZone.type === 'merge' && groupingEnabled) {
        if (dragId === rawZone.targetId) return
        // Don't merge back into the same group
        if (fromGroupId && rawZone.targetId === fromGroupId) return
        await handleMerge(dragId, dragKind, rawZone.targetId, fromGroupId)
      } else {
        const rawIndex =
          rawZone.type === 'insert'
            ? rawZone.index
            : mergeZoneToInsertIndex(rects, rawZone.targetId)
        const index = toFullIndex(rawIndex, draggingFullIndex)
        await handleReorder(dragId, dragKind, index, fromGroupId)
      }
    },
    [
      aiNamingEnabled,
      boardCards,
      boardId,
      columnType,
      dispatch,
      groupingEnabled,
      publish,
    ],
  )

  const handleReorder = async (
    dragId: string,
    dragKind: string,
    _index: number,
    fromGroupId?: string,
  ) => {
    const newPosition = _index + 1

    if (dragKind === 'card') {
      if (fromGroupId) {
        await detachFromGroup(dragId, fromGroupId)
      }

      const card = boardCards.cards[dragId]
      if (
        !fromGroupId &&
        card?.position === newPosition &&
        card?.column === columnType
      )
        return

      dispatch({
        type: BoardCardsMessageType.UPDATE_CARD_POSITION,
        cardId: dragId,
        position: newPosition,
        column: columnType,
      })
      await updateCardPosition({
        cardId: dragId,
        position: newPosition,
        column: columnType,
      })
      publish({
        data: {
          type: BoardCardsMessageType.UPDATE_CARD_POSITION,
          payload: {
            cardId: dragId,
            position: newPosition,
            column: columnType,
          },
        },
      })
    } else {
      const group = boardCards.groups[dragId]
      if (group?.position === newPosition && group?.column === columnType)
        return

      dispatch({
        type: BoardCardsMessageType.UPDATE_GROUP_POSITION,
        groupId: dragId,
        position: newPosition,
        column: columnType,
      })
      await editCardGroup({
        cardGroupId: dragId,
        position: newPosition,
        column: columnType,
      })
      publish({
        data: {
          type: BoardCardsMessageType.UPDATE_GROUP_POSITION,
          payload: {
            groupId: dragId,
            position: newPosition,
            column: columnType,
          },
        },
      })
    }
  }

  const handleRemoveFromGroup = useCallback(
    async (groupId: string, cardId: string) => {
      const group = boardCards.groups[groupId]
      if (!group) return

      if (group.cardIds.length <= 2) {
        // Dissolving group — delete the group, which restores all cards
        await deleteCardGroup(groupId)
        const remaining = group.cardIds.filter(id => id !== cardId)
        const restoredCards = [
          ...remaining.map((id, i) => ({
            cardId: id,
            position: group.position + i,
          })),
          { cardId, position: group.position + remaining.length },
        ]
        dispatch({
          type: BoardCardsMessageType.DELETE_CARD_GROUP,
          groupId,
          restoredCards,
        })
        publish({
          data: {
            type: BoardCardsMessageType.DELETE_CARD_GROUP,
            payload: { groupId, restoredCards },
          },
        })
      } else {
        await removeCardFromGroup({ cardId })
        const maxPos = Math.max(
          ...Object.values(boardCards.cards)
            .filter(c => c.column === columnType && !c.cardGroupId)
            .map(c => c.position ?? 0),
          ...Object.values(boardCards.groups)
            .filter(g => g.column === columnType)
            .map(g => g.position),
        )
        const newPos = maxPos + 1

        dispatch({
          type: BoardCardsMessageType.REMOVE_CARD_FROM_GROUP,
          cardId,
          groupId,
          position: newPos,
        })
        publish({
          data: {
            type: BoardCardsMessageType.REMOVE_CARD_FROM_GROUP,
            payload: { cardId, groupId, position: newPos },
          },
        })
      }
    },
    [boardCards, columnType, dispatch, publish],
  )

  return {
    dropState,
    bodyRef,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromGroup,
  }
}

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

function getDropZone(e: React.DragEvent, bodyEl: HTMLElement): DropZone {
  const items = [
    ...bodyEl.querySelectorAll<HTMLElement>('[data-id]:not(.dragging)'),
  ]

  for (const [i, item] of items.entries()) {
    const r = item.getBoundingClientRect()
    if (e.clientY < r.top) return { type: 'insert', index: i }
    if (e.clientY > r.bottom) continue

    const rel = (e.clientY - r.top) / r.height

    if (rel < 0.28) return { type: 'insert', index: i }
    if (rel <= 0.72) {
      return { type: 'merge', targetId: item.dataset.id! }
    }
    return { type: 'insert', index: i + 1 }
  }

  return { type: 'insert', index: items.length }
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

      const rawZone = getDropZone(e, body)
      let zone: DropZone = rawZone
      if (!groupingEnabled && rawZone.type === 'merge') {
        const items = [
          ...body.querySelectorAll<HTMLElement>('[data-id]:not(.dragging)'),
        ]
        const targetIdx = items.findIndex(
          el => el.dataset.id === rawZone.targetId,
        )
        const insertIdx = targetIdx === -1 ? items.length : targetIdx + 1
        zone = { type: 'insert', index: insertIdx }
      }
      const next: DropState =
        zone.type === 'insert'
          ? { type: 'insert', colId: columnType, index: zone.index }
          : { type: 'merge', colId: columnType, targetId: zone.targetId }

      setDropState(prev => {
        if (
          prev?.type === next.type &&
          prev?.colId === next.colId &&
          (next.type === 'insert'
            ? (prev as any).index === next.index
            : (prev as any).targetId === (next as any).targetId)
        ) {
          return prev
        }
        return next
      })
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
      const rawZone = body
        ? getDropZone(e, body)
        : { type: 'insert' as const, index: 0 }

      if (rawZone.type === 'merge' && groupingEnabled) {
        if (dragId === rawZone.targetId) return
        // Don't merge back into the same group
        if (fromGroupId && rawZone.targetId === fromGroupId) return
        await handleMerge(dragId, dragKind, rawZone.targetId, fromGroupId)
      } else {
        const index =
          rawZone.type === 'insert'
            ? rawZone.index
            : (() => {
                if (!body) return 0
                const items = [
                  ...body.querySelectorAll<HTMLElement>(
                    '[data-id]:not(.dragging)',
                  ),
                ]
                const idx = items.findIndex(
                  el => el.dataset.id === rawZone.targetId,
                )
                return idx === -1 ? items.length : idx + 1
              })()
        await handleReorder(dragId, dragKind, index, fromGroupId)
      }
    },
    [aiNamingEnabled, boardCards, boardId, columnType, dispatch, groupingEnabled, publish],
  )

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

  const handleMerge = async (
    srcId: string,
    srcKind: string,
    targetId: string,
    fromGroupId?: string,
  ) => {
    const targetCard = boardCards.cards[targetId]
    const targetGroup = boardCards.groups[targetId]

    if (srcKind === 'card') {
      const srcCard = boardCards.cards[srcId]
      if (!srcCard) return

      if (fromGroupId) {
        await detachFromGroup(srcId, fromGroupId)
      }

      if (targetGroup) {
        // Card onto existing group → add to group
        await addCardToGroup({ cardId: srcId, cardGroupId: targetGroup.id })
        dispatch({
          type: BoardCardsMessageType.ADD_CARD_TO_GROUP,
          cardId: srcId,
          groupId: targetGroup.id,
        })
        publish({
          data: {
            type: BoardCardsMessageType.ADD_CARD_TO_GROUP,
            payload: { cardId: srcId, groupId: targetGroup.id },
          },
        })

        if (aiNamingEnabled) {
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
            dispatch({
              type: BoardCardsMessageType.UPDATE_CARD_GROUP,
              groupId: targetGroup.id,
              patch: { label, isGeneratingLabel: false },
            })
            publish({
              data: {
                type: BoardCardsMessageType.UPDATE_CARD_GROUP,
                payload: { groupId: targetGroup.id, patch: { label } },
              },
            })
          } else {
            dispatch({
              type: BoardCardsMessageType.UPDATE_CARD_GROUP,
              groupId: targetGroup.id,
              patch: { isGeneratingLabel: false },
            })
          }
        }
      } else if (targetCard) {
        const createGroup = async (label: string) => {
          const result = await createCardGroup({
            boardId,
            column: columnType,
            label,
            cardId1: targetId,
            cardId2: srcId,
            position: targetCard.position,
          })
          if (result) {
            const groupState: CardGroupState = {
              id: result.id,
              label: result.label,
              column: result.column,
              position: result.position,
              retroSessionId: result.retroSessionId,
              createdAt: result.createdAt,
              updatedAt: result.updatedAt,
              cardIds: [targetId, srcId],
            }
            dispatch({
              type: BoardCardsMessageType.CREATE_CARD_GROUP,
              group: groupState,
              cardIds: [targetId, srcId],
            })
            publish({
              data: {
                type: BoardCardsMessageType.CREATE_CARD_GROUP,
                payload: { group: groupState, cardIds: [targetId, srcId] },
              },
            })
          }
        }

        if (aiNamingEnabled) {
          const result = await createCardGroup({
            boardId,
            column: columnType,
            label: '',
            cardId1: targetId,
            cardId2: srcId,
            position: targetCard.position,
          })
          if (result) {
            const groupState: CardGroupState = {
              id: result.id,
              label: result.label,
              column: result.column,
              position: result.position,
              retroSessionId: result.retroSessionId,
              createdAt: result.createdAt,
              updatedAt: result.updatedAt,
              cardIds: [targetId, srcId],
              isGeneratingLabel: true,
            }
            dispatch({
              type: BoardCardsMessageType.CREATE_CARD_GROUP,
              group: groupState,
              cardIds: [targetId, srcId],
            })
            publish({
              data: {
                type: BoardCardsMessageType.CREATE_CARD_GROUP,
                payload: { group: groupState, cardIds: [targetId, srcId] },
              },
            })

            const contents = [targetCard.content, srcCard.content]
            const label =
              (await generateGroupLabel(contents)) ?? 'Grouped Cards'
            await editCardGroup({ cardGroupId: result.id, label })
            dispatch({
              type: BoardCardsMessageType.UPDATE_CARD_GROUP,
              groupId: result.id,
              patch: { label, isGeneratingLabel: false },
            })
            publish({
              data: {
                type: BoardCardsMessageType.UPDATE_CARD_GROUP,
                payload: { groupId: result.id, patch: { label } },
              },
            })
          }
        } else {
          openModal('CreateCardGroupModal', {
            onSubmit: createGroup,
          })
        }
      }
    } else if (srcKind === 'group') {
      const srcGroup = boardCards.groups[srcId]
      if (!srcGroup) return

      if (targetCard) {
        // Group onto standalone card → add card to group & move group
        await addCardToGroup({ cardId: targetId, cardGroupId: srcGroup.id })
        dispatch({
          type: BoardCardsMessageType.ADD_CARD_TO_GROUP,
          cardId: targetId,
          groupId: srcGroup.id,
        })
        publish({
          data: {
            type: BoardCardsMessageType.ADD_CARD_TO_GROUP,
            payload: { cardId: targetId, groupId: srcGroup.id },
          },
        })

        // Move group to the target card's column/position
        const newPosition = targetCard.position ?? 1
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
      } else if (targetGroup) {
        // Group onto group → merge all cards and set label
        const mergeGroups = async (label: string) => {
          for (const cardId of srcGroup.cardIds) {
            await addCardToGroup({ cardId, cardGroupId: targetGroup.id })
            dispatch({
              type: BoardCardsMessageType.ADD_CARD_TO_GROUP,
              cardId,
              groupId: targetGroup.id,
            })
            publish({
              data: {
                type: BoardCardsMessageType.ADD_CARD_TO_GROUP,
                payload: { cardId, groupId: targetGroup.id },
              },
            })
          }
          await deleteCardGroup(srcId)
          dispatch({
            type: BoardCardsMessageType.DELETE_CARD_GROUP,
            groupId: srcId,
            restoredCards: [],
          })
          publish({
            data: {
              type: BoardCardsMessageType.DELETE_CARD_GROUP,
              payload: { groupId: srcId, restoredCards: [] },
            },
          })
          await editCardGroup({ cardGroupId: targetGroup.id, label })
          dispatch({
            type: BoardCardsMessageType.UPDATE_CARD_GROUP,
            groupId: targetGroup.id,
            patch: { label },
          })
          publish({
            data: {
              type: BoardCardsMessageType.UPDATE_CARD_GROUP,
              payload: { groupId: targetGroup.id, patch: { label } },
            },
          })
        }

        if (aiNamingEnabled) {
          dispatch({
            type: BoardCardsMessageType.UPDATE_CARD_GROUP,
            groupId: targetGroup.id,
            patch: { isGeneratingLabel: true },
          })
          const allCardIds = [...targetGroup.cardIds, ...srcGroup.cardIds]
          const contents = allCardIds
            .map(id => boardCards.cards[id]?.content)
            .filter(Boolean)
          const label =
            (await generateGroupLabel(contents)) ?? 'Grouped Cards'
          await mergeGroups(label)
          dispatch({
            type: BoardCardsMessageType.UPDATE_CARD_GROUP,
            groupId: targetGroup.id,
            patch: { isGeneratingLabel: false },
          })
        } else {
          openModal('CreateCardGroupModal', {
            onSubmit: mergeGroups,
          })
        }
      }
    }
  }

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

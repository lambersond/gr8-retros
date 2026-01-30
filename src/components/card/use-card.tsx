'use client'

import { useChannel } from 'ably/react'
import { useParams } from 'next/navigation'
import { useModals } from '@/hooks/use-modals'
import { useCommentsSidebarActions } from '@/providers/comments-sidebar'
import { useBoardMembers } from '@/providers/retro-board/board-settings'
import { BoardCardsMessageType } from '@/providers/retro-board/cards'
import type { ColumnType } from '@/types'

export function useCard({
  column,
  cardId,
  currentUserId,
}: {
  column: ColumnType
  cardId: string
  currentUserId?: string
}) {
  const { openModal } = useModals()
  const { id } = useParams() satisfies { id: string }
  const { publish } = useChannel(id)
  const { openSidebar } = useCommentsSidebarActions()
  const members = useBoardMembers()

  const assignableUsers = members.map(member => member.user)

  const handleUpvote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const resp = await fetch('/api/card/upvote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ cardId }),
    })

    if (resp.ok && currentUserId) {
      publish({
        data: {
          type: BoardCardsMessageType.TOGGLE_UPVOTE,
          payload: { cardId, userId: currentUserId },
        },
      })
    }
  }

  const handleDiscussed =
    (isDiscussed: boolean) =>
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      const resp = await fetch('/api/card/discussed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ cardId, isDiscussed }),
      })

      if (resp.ok) {
        publish({
          data: {
            type: BoardCardsMessageType.UPDATE_CARD,
            payload: { cardId, patch: { isDiscussed } },
          },
        })
      }
    }

  const handleEdit =
    (content: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      openModal('UpsertContentModal', {
        defaultContent: content,
        onSubmit: (data: string) =>
          handleEditCardSubmit(data, cardId, column, publish),
        title: 'Edit Card',
      })
    }

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    openModal('ConfirmModal', {
      title: 'Delete Card',
      color: 'danger',
      message: 'Are you sure you want to delete this card?',
      onConfirm: () => {
        fetch('/api/card/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ cardId }),
        }).then(res => {
          if (res.ok) {
            publish({
              data: {
                type: BoardCardsMessageType.DELETE_CARD,
                payload: { cardId },
              },
            })
          }
        })
      },
    })
  }

  const handleAddActionItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    openModal('UpsertActionItemModal', {
      assignableUsers,
      title: 'Add Action Item',
      placeholder: 'Hupperduke will email client getting clarity on...',
      onSubmit: async (data: any) => {
        const resp = await fetch(
          `/api/board/${id}/card/${cardId}/action-item`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
          },
        )

        if (resp.ok) {
          const newActionItem = await resp.json()
          publish({
            data: {
              type: BoardCardsMessageType.ADD_ACTION_ITEM,
              payload: { cardId, actionItem: newActionItem },
            },
          })
        }
      },
    })
  }

  const handleToggleDoneActionItem =
    (actionItemId: string, isDone: boolean) =>
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      const resp = await fetch('/api/action-item/done', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ actionItemId, isDone }),
      })

      if (resp.ok) {
        publish({
          data: {
            type: BoardCardsMessageType.UPDATE_ACTION_ITEM,
            payload: { cardId, actionItemId, patch: { isDone } },
          },
        })
      }
    }

  const handleUpdateActionItem =
    (actionItemId: string, defaultContent: string, assignedToId?: string) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      openModal('UpsertActionItemModal', {
        assignableUsers,
        title: 'Edit Action Item',
        placeholder: 'Hupperduke will edit the email getting clarity on...',
        defaultContent,
        assignedToId,
        onSubmit: (data: any) =>
          handleEditActionItemSubmit(
            data,
            cardId,
            actionItemId,
            column,
            `/api/board/${id}/card/${cardId}/action-item/${actionItemId}`,
            publish,
          ),
        onDelete: () => {
          fetch('/api/action-item', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ actionItemId }),
          }).then(res => {
            if (res.ok) {
              publish({
                data: {
                  type: BoardCardsMessageType.DELETE_ACTION_ITEM,
                  payload: { cardId, actionItemId },
                },
              })
            }
          })
        },
      })
    }

  const openCommentsSidebar = () => {
    openSidebar(cardId, id, column)
  }

  return {
    handleUpvote,
    handleDiscussed,
    handleEdit,
    handleDelete,
    handleAddActionItem,
    handleToggleDoneActionItem,
    handleUpdateActionItem,
    openCommentsSidebar,
  }
}

async function handleEditCardSubmit(
  data: string,
  cardId: string,
  column: ColumnType,
  publish: (message: any) => void,
) {
  const resp = await fetch('/api/card/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ cardId, content: data }),
  })
  if (resp.ok) {
    const editedCard = await resp.json()
    if (editedCard) {
      publish({
        data: {
          type: BoardCardsMessageType.UPDATE_CARD,
          payload: { cardId, patch: { content: editedCard.content } },
        },
      })
    }
  }
}

async function handleEditActionItemSubmit(
  data: string,
  cardId: string,
  actionItemId: string,
  column: ColumnType,
  apiPath: string,
  publish: (message: any) => void,
) {
  const resp = await fetch(apiPath, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (resp.ok) {
    const patch = await resp.json()
    publish({
      data: {
        type: BoardCardsMessageType.UPDATE_ACTION_ITEM,
        payload: {
          cardId,
          actionItemId,
          patch,
        },
      },
    })
  }
}

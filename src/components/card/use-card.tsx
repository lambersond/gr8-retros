'use client'

import { useChannel } from 'ably/react'
import { useParams } from 'next/navigation'
import { ACTION_TYPES } from '../retro-board/constants'
import { useModals } from '@/hooks/use-modals'
import { ColumnType } from '@/types'

export function useCard({
  column,
  cardId,
  currentUserId,
}: {
  column: ColumnType
  cardId: string
  currentUserId: string
}) {
  const { openModal } = useModals()
  const { id } = useParams()
  const { publish } = useChannel(id as string)

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

    if (resp.ok) {
      publish({
        data: {
          type: ACTION_TYPES.TOGGLE_UPVOTE,
          payload: { cardId, userId: currentUserId },
          column,
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
            type: ACTION_TYPES.MARK_DISCUSSED,
            payload: { cardId, isDiscussed },
            column,
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
                type: ACTION_TYPES.DELETE_CARD,
                payload: { cardId },
                column,
              },
            })
          }
        })
      },
    })
  }

  const handleAddActionItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    openModal('UpsertContentModal', {
      onSubmit: async (data: string) => {
        const resp = await fetch('/api/action-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ cardId, content: data }),
        })

        if (resp.ok) {
          const newActionItem = await resp.json()
          publish({
            data: {
              type: ACTION_TYPES.ADD_ACTION_ITEM,
              payload: { cardId, actionItem: newActionItem },
              column,
            },
          })
        }
      },
      title: 'Add Action Item',
      placeholder: 'Hupperduke will email client getting clarity on...',
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
            type: ACTION_TYPES.TOGGLE_DONE_ACTION_ITEM,
            payload: { cardId, actionItemId, isDone },
            column,
          },
        })
      }
    }

  const handleUpdateActionItemContent =
    (actionItemId: string, content: string) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      openModal('UpsertContentModal', {
        defaultContent: content,
        onSubmit: (data: string) =>
          handleEditActionItemSubmit(
            data,
            cardId,
            actionItemId,
            column,
            publish,
          ),
      })
    }

  return {
    handleUpvote,
    handleDiscussed,
    handleEdit,
    handleDelete,
    handleAddActionItem,
    handleToggleDoneActionItem,
    handleUpdateActionItemContent,
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
          type: ACTION_TYPES.UPDATE_CARD,
          column,
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
  publish: (message: any) => void,
) {
  const resp = await fetch('/api/action-item/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ actionItemId, content: data }),
  })
  if (resp.ok) {
    const editedActionItem = await resp.json()
    if (editedActionItem) {
      publish({
        data: {
          type: ACTION_TYPES.UPDATE_ACTION_ITEM,
          column,
          payload: {
            cardId,
            actionItemId,
            patch: { content: editedActionItem.content },
          },
        },
      })
    }
  }
}

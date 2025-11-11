'use client'

import { useCards } from '../retro-board'
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
  const {
    addActionItem,
    deleteCard,
    markDiscussed,
    toggleDoneActionItem,
    toggleUpvote,
    updateActionItem,
    updateCard,
  } = useCards(column)
  const { openModal } = useModals()

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
      toggleUpvote(cardId, currentUserId)
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
        markDiscussed(cardId, isDiscussed)
      }
    }

  const handleEdit =
    (content: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      openModal('UpsertContentModal', {
        defaultContent: content,
        onSubmit: (data: string) =>
          handleEditCardSubmit(data, cardId, updateCard),
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
            deleteCard(cardId)
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
          addActionItem(cardId, newActionItem)
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
        toggleDoneActionItem(cardId, actionItemId, isDone)
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
            updateActionItem,
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
  updateCard: (cardId: string, update: { content: string }) => void,
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
      updateCard(cardId, { content: editedCard.content })
    }
  }
}

async function handleEditActionItemSubmit(
  data: string,
  cardId: string,
  actionItemId: string,
  updateActionItem: (
    cardId: string,
    actionItemId: string,
    update: { content: string },
  ) => void,
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
      updateActionItem(cardId, actionItemId, {
        content: editedActionItem.content,
      })
    }
  }
}

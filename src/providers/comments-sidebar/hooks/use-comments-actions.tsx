import { useChannel } from 'ably/react'
import { useCommentsSidebar } from '../comments-sidebar-provider'
import { ACTION_TYPES } from '@/components/retro-board'

export function useCommentsActions() {
  const { boardId, column } = useCommentsSidebar()
  const { publish } = useChannel(boardId)

  async function addComment(content: string, cardId?: string) {
    if (!cardId) return

    const resp = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, cardId }),
    })

    if (resp.ok) {
      const newComment = await resp.json()
      publish({
        data: {
          type: ACTION_TYPES.ADD_CARD_COMMENT,
          payload: { column, newComment },
        },
      })
    }
  }

  async function updateComment(id: string, content: string) {
    const resp = await fetch('/api/comments', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, content }),
    })

    if (resp.ok) {
      const updatedComment = await resp.json()
      publish({
        data: {
          type: ACTION_TYPES.UPDATE_CARD_COMMENT,
          payload: { updatedComment, column },
        },
      })
    }
  }

  async function deleteComment(id: string, cardId: string) {
    const resp = await fetch('/api/comments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (resp.ok) {
      publish({
        data: {
          type: ACTION_TYPES.DELETE_CARD_COMMENT,
          payload: { commentId: id, cardId, column },
        },
      })
    }
  }

  return {
    addComment,
    updateComment,
    deleteComment,
  }
}

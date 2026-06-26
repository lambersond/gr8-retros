import { useChannel } from 'ably/react'
import { useAuth } from '@/hooks/use-auth'
import { useBoardId } from '@/hooks/use-board-id'
import { useModals } from '@/hooks/use-modals'
import { useColumnItems } from '@/providers/retro-board/cards'

export function useColumn(
  columnType: string,
  title: string,
  placeholder?: string,
) {
  const id = useBoardId()
  const { user } = useAuth()
  const items = useColumnItems(columnType)
  const { openModal } = useModals()
  const { publish } = useChannel(id as string)

  const handleAddCard = () => {
    openModal('UpsertContentModal', {
      onSubmit: (data: string) => {
        fetch(`/api/board/${id}/content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ content: data, type: columnType }),
        })
          .then(resp => resp.json())
          .then(newCard => {
            publish({
              data: {
                type: 'ADD_CARD',
                payload: newCard,
              },
            })
          })
      },
      title,
      placeholder,
    })
  }

  return { items, handleAddCard, user }
}

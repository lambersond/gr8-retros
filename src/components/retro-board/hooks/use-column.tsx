import { useChannel } from 'ably/react'
import { useParams } from 'next/navigation'
import { useCards } from './use-cards'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import type { ColumnType } from '@/types'

export function useColumn(
  columnType: ColumnType,
  title: string,
  placeholder?: string,
) {
  const { id } = useParams()
  const { user } = useAuth()
  const { cards } = useCards(columnType)
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
                column: columnType,
                payload: newCard,
              },
            })
          })
      },
      title,
      placeholder,
    })
  }

  return { cards, handleAddCard, user }
}

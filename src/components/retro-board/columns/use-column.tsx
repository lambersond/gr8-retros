import { useParams } from 'next/navigation'
import { useCards } from '../provider/use-cards'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import type { ColumnType } from '@/types'

export function useColumn(
  columnType: ColumnType,
  title: string,
  placeholder?: string,
) {
  const { cards, addCard } = useCards(columnType)
  const { openModal } = useModals()
  const { id } = useParams()
  const { user } = useAuth()

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
            addCard(newCard)
          })
      },
      title,
      placeholder,
    })
  }

  return { cards, handleAddCard, user }
}

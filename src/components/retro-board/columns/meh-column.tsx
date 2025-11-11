import { useColumn } from './use-column'
import { Column } from '@/components/column'
import { MEH } from '@/constants'

export function MehColumn() {
  const { cards, handleAddCard, user } = useColumn(
    MEH,
    'What could be better?',
    'More napkins on the table...',
  )
  return (
    <Column
      type={MEH}
      cards={cards}
      onAdd={handleAddCard}
      currentUserId={user?.id}
    />
  )
}

import { useColumn } from './use-column'
import { Column } from '@/components/column'
import { BAD } from '@/constants'

export function BadColumn() {
  const { cards, handleAddCard, user } = useColumn(
    BAD,
    'What was frustrating?',
    'All the muffins were gone...',
  )
  return (
    <Column
      type={BAD}
      cards={cards}
      onAdd={handleAddCard}
      currentUserId={user?.id}
    />
  )
}

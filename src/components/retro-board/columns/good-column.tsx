import { useColumn } from './use-column'
import { Column } from '@/components/column'
import { GOOD } from '@/constants'

export function GoodColumn() {
  const { cards, handleAddCard, user } = useColumn(GOOD, 'What went well?')
  return (
    <Column
      type={GOOD}
      cards={cards}
      onAdd={handleAddCard}
      currentUserId={user?.id}
    />
  )
}

import { useColumn } from '../hooks/use-column'
import { Column } from '@/components/column'
import { SHOUTOUT } from '@/constants'

export function ShoutoutColumn() {
  const { cards, handleAddCard, user } = useColumn(
    SHOUTOUT,
    'What are we celebrating?',
    'Felderwin closed that big deal!',
  )
  return (
    <Column
      type={SHOUTOUT}
      cards={cards}
      onAdd={handleAddCard}
      currentUserId={user?.id}
    />
  )
}

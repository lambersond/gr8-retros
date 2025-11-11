import { Plus } from 'lucide-react'
import { IconButton } from '../common'
import { COLUMN } from './constants'
import { getTitleClasses, getWrapperClasses } from './utils'
import { Card } from '@/components/card'
import type { ColumnProps } from './types'
import type { ColumnType } from '@/types'

export function Column({
  type,
  onAdd,
  currentUserId,
  cards = [],
}: Readonly<ColumnProps>) {
  const wrapperClasses = getWrapperClasses(type)
  const titleClasses = getTitleClasses(type)

  return (
    <div className={wrapperClasses}>
      <p className={titleClasses}>{COLUMN[type]}</p>
      <div className='absolute top-1 right-1'>
        <IconButton
          icon={Plus}
          tooltip='Add Card'
          size='xl'
          intent='primary'
          onClick={onAdd}
        />
      </div>
      <div className='flex-1 min-h-0 flex flex-col gap-3 p-3 overflow-y-auto'>
        {cards.map(card => (
          <Card
            key={card.id}
            canEdit={card.creatorId === currentUserId}
            upvotes={card.upvotedBy.length}
            isUpvoted={card.upvotedBy.includes(currentUserId ?? '')}
            column={card.column as any as ColumnType}
            id={card.id}
            currentUserId={currentUserId}
            isDiscussed={card.isDiscussed}
            createdBy={card.createdBy}
            content={card.content}
            actionItems={card.actionItems}
          />
        ))}
      </div>
    </div>
  )
}

import clsx from 'clsx'
import { X } from 'lucide-react'
import { CardCollapsed } from '../card-collapsed'
import type { CardGroupExpandedListProps } from './types'

export function CardGroupExpandedList({
  memberCards,
  groupId,
  isDragEnabled,
  currentUserId,
  onRemoveCard,
}: Readonly<CardGroupExpandedListProps>) {
  return (
    <div className='mt-3 border-t border-border-light pt-3 px-3 pb-3 flex flex-col gap-1'>
      {memberCards.map(card => (
        <summary
          key={card.id}
          draggable={isDragEnabled}
          onDragStart={
            isDragEnabled
              ? e => {
                  e.stopPropagation()
                  const target = e.currentTarget as HTMLElement
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData(
                    'text/plain',
                    JSON.stringify({
                      id: card.id,
                      kind: 'card',
                      fromGroupId: groupId,
                    }),
                  )
                  requestAnimationFrame(() => {
                    target.classList.add('dragging')
                    target.style.opacity = '0.25'
                  })
                }
              : undefined
          }
          onDragEnd={
            isDragEnabled
              ? e => {
                  const target = e.currentTarget as HTMLElement
                  target.classList.remove('dragging')
                  target.style.opacity = ''
                }
              : undefined
          }
          className={clsx(
            'flex items-start border border-border-light rounded-md bg-card',
            isDragEnabled && 'cursor-grab',
          )}
        >
          <div className='flex-1 min-w-0'>
            <CardCollapsed
              id={card.id}
              content={card.content}
              column={card.column}
              canEdit={card.creatorId === currentUserId}
              upvotes={card.upvotedBy.length}
              isUpvoted={card.upvotedBy.includes(currentUserId ?? '')}
              isDiscussed={card.isDiscussed}
              createdBy={card.createdBy}
              currentUserId={currentUserId}
              comments={card.comments}
            />
          </div>
          {onRemoveCard && (
            <button
              data-no-drag
              className='shrink-0 mt-2 mr-1 text-text-secondary hover:text-danger transition-colors cursor-pointer'
              title='Remove from group'
              onMouseDown={e => e.stopPropagation()}
              onClick={onRemoveCard(card.id)}
            >
              <X className='size-4' />
            </button>
          )}
        </summary>
      ))}
    </div>
  )
}

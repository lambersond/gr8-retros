import { Plus } from 'lucide-react'
import { IconButton } from '../../../common'
import { useColumn } from '../../hooks/use-column'
import {
  getTitleClasses,
  getTitleStyles,
  getWrapperClasses,
  getWrapperStyles,
} from './utils'
import { Card } from '@/components/card'
import { PRESET_COLUMNS } from '@/constants'
import { VotingState } from '@/enums'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import type { ColumnProps } from './types'
import type { ColumnType } from '@/types'

export function Column({ type, columnConfig }: Readonly<ColumnProps>) {
  const { cards, handleAddCard, user } = useColumn(
    type as ColumnType,
    columnConfig?.tagline ?? 'Add Card Content',
    columnConfig?.placeholder ?? 'Enter card content...',
  )

  const isDark = false // TODO: get from theme context or similar

  const activeStyle = columnConfig ?? PRESET_COLUMNS[type]
  const colors = isDark ? activeStyle.dark : activeStyle.light
  const label = [activeStyle.emoji, activeStyle.label].filter(Boolean).join(' ')

  const { isVoteOpen } = useBoardControlsState(s => ({
    isVoteOpen: s.boardControls.voting.state === VotingState.OPEN,
  }))

  return (
    <div className={getWrapperClasses()} style={getWrapperStyles(colors)}>
      <p className={getTitleClasses()} style={getTitleStyles(colors)}>
        {label}
      </p>
      {!isVoteOpen && (
        <div className='absolute top-1 right-1'>
          <IconButton
            icon={Plus}
            tooltip='Add Card'
            size='xl'
            intent='text-primary'
            onClick={handleAddCard}
          />
        </div>
      )}
      <div className='flex-1 min-h-0 flex flex-col gap-3 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700/10 scrollbar-track-transparent'>
        {cards.map(card => (
          <Card
            key={card.id}
            canEdit={card.creatorId === user?.id}
            upvotes={card.upvotedBy.length}
            isUpvoted={card.upvotedBy.includes(user?.id ?? '')}
            column={card.column as ColumnType}
            id={card.id}
            currentUserId={user?.id}
            isDiscussed={card.isDiscussed}
            createdBy={card.createdBy}
            content={card.content}
            actionItems={card.actionItems}
            comments={card.comments}
          />
        ))}
      </div>
    </div>
  )
}

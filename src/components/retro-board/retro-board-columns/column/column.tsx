import clsx from 'classnames'
import { Plus } from 'lucide-react'
import { useTheme } from 'next-themes'
import { IconButton } from '../../../common'
import { useColumn } from '../../hooks/use-column'
import { useColumnDragDrop } from '../../hooks/use-column-drag-drop'
import {
  getTitleClasses,
  getTitleStyles,
  getWrapperClasses,
  getWrapperStyles,
} from './utils'
import { Card, CardGroup, CardGroupVoting } from '@/components/card'
import { PRESET_COLUMNS } from '@/constants'
import { VotingState } from '@/enums'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import type { ColumnProps } from './types'

export function Column({ type, columnConfig }: Readonly<ColumnProps>) {
  const { items, handleAddCard, user } = useColumn(
    type,
    columnConfig?.tagline ?? 'Add Card Content',
    columnConfig?.placeholder ?? 'Enter card content...',
  )
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const activeStyle = columnConfig ?? PRESET_COLUMNS[type]
  const colors = isDark ? activeStyle.dark : activeStyle.light
  const label = [activeStyle.emoji, activeStyle.label].filter(Boolean).join(' ')

  const { isVoteOpen, votingResults } = useBoardControlsState(s => ({
    isVoteOpen: s.boardControls.voting.state === VotingState.OPEN,
    votingResults: s.boardControls.voting.results,
  }))

  const {
    dropState,
    bodyRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFromGroup,
  } = useColumnDragDrop(type)

  const isOverInsert = dropState?.type === 'insert' && dropState.colId === type

  return (
    <div
      className={clsx(
        getWrapperClasses(),
        isOverInsert && 'ring-2 ring-primary',
      )}
      style={getWrapperStyles(colors)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
      <div
        ref={bodyRef}
        className='flex-1 min-h-0 flex flex-col gap-3 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700/10 scrollbar-track-transparent'
      >
        {isOverInsert && dropState.index === 0 && <InsertionLine />}

        {items.map((item, i: number) => (
          <div key={`${item.kind}-${item.data.id}`}>
            {item.kind === 'card' && (
              <Card
                canEdit={item.data.creatorId === user?.id}
                upvotes={item.data.upvotedBy.length}
                isUpvoted={item.data.upvotedBy.includes(user?.id ?? '')}
                column={item.data.column}
                id={item.data.id}
                currentUserId={user?.id}
                isDiscussed={item.data.isDiscussed}
                createdBy={item.data.createdBy}
                content={item.data.content}
                actionItems={item.data.actionItems}
                comments={item.data.comments}
                isMergeTarget={
                  dropState?.type === 'merge' &&
                  dropState.targetId === item.data.id
                }
              />
            )}
            {item.kind === 'group' && isVoteOpen && (
              <CardGroupVoting group={item.data} />
            )}
            {item.kind === 'group' && !isVoteOpen && (
              <CardGroup
                group={item.data}
                currentUserId={user?.id}
                isMergeTarget={
                  dropState?.type === 'merge' &&
                  dropState.targetId === item.data.id
                }
                onRemoveCard={handleRemoveFromGroup}
                votes={votingResults[item.data.id]?.length}
              />
            )}
            {isOverInsert && dropState.index === i + 1 && <InsertionLine />}
          </div>
        ))}
      </div>
    </div>
  )
}

function InsertionLine() {
  return (
    <div className='relative h-0.5 rounded-full bg-primary my-1 shrink-0'>
      <div className='absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary' />
      <div className='absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary' />
    </div>
  )
}

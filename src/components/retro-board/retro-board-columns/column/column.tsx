import clsx from 'clsx'
import { Info, Plus } from 'lucide-react'
import { useTheme } from 'next-themes'
import { IconButton, Tooltip } from '../../../common'
import { useColumn } from '../../hooks/use-column'
import { useColumnDragDrop } from '../../hooks/use-column-drag-drop'
import { getTitleStyles, getWrapperStyles } from './utils'
import {
  Card,
  CardGroup,
  CardGroupVoting,
  ReflectingStack,
} from '@/components/card'
import { GuidedPhase, VotingState } from '@/enums'
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
  const activeStyle = columnConfig
  const colors = isDark ? activeStyle.dark : activeStyle.light
  const label = [activeStyle.emoji, activeStyle.label].filter(Boolean).join(' ')

  const { isVoteOpen, isVotingIdle, votingResults, guidedReflect } =
    useBoardControlsState(s => ({
      isVoteOpen: s.boardControls.voting.state === VotingState.OPEN,
      isVotingIdle: s.boardControls.voting.state === VotingState.IDLE,
      votingResults: s.boardControls.voting.results,
      guidedReflect:
        !!s.boardControls.guided?.isActive &&
        s.boardControls.guided.phase === GuidedPhase.REFLECT,
    }))

  // In the guided Reflect phase, only the current user's own cards are shown
  // (at the top); everyone else's are collapsed into a single hidden stack.
  const ownItems = guidedReflect
    ? items.filter(
        item => item.kind === 'group' || item.data.creatorId === user?.id,
      )
    : items
  const hiddenReflectionCount = guidedReflect
    ? items.length - ownItems.length
    : 0

  // The hidden-reflections stack gets an animated color ring in this column's
  // palette (see .reflect-ring in globals.css).
  const ringStyle = {
    ['--reflect-c1']: colors.border,
    ['--reflect-c2']: colors.titleBg,
    ['--reflect-c3']: colors.titleText,
  } as React.CSSProperties

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
    <summary
      className={clsx(
        'flex flex-col min-h-0 h-full rounded-lg border-2 relative',
        isOverInsert && 'ring-2 ring-primary',
      )}
      style={getWrapperStyles(colors)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p
        className='text-xl tracking-tight font-semibold w-full text-left p-3 rounded-t-md'
        style={getTitleStyles(colors)}
      >
        {label}
      </p>
      <div className='absolute top-1 right-1'>
        {isVotingIdle ? (
          <IconButton
            icon={Plus}
            tooltip='Add Card'
            size='xl'
            intent='text-primary'
            onClick={handleAddCard}
          />
        ) : (
          <Tooltip
            title='Cards cannot be added while voting is in progress'
            placement='bottom'
            asChild
          >
            <Info className='size-7 p-1 text-text-tertiary' />
          </Tooltip>
        )}
      </div>
      <div
        ref={bodyRef}
        className='flex-1 min-h-0 flex flex-col gap-3 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-700/10 scrollbar-track-transparent'
      >
        {isOverInsert && dropState.index === 0 && <InsertionLine />}

        {ownItems.map((item, i: number) => (
          <div key={`${item.kind}-${item.data.id}`}>
            {item.kind === 'card' && (
              <Card
                canEdit={item.data.creatorId === user?.id}
                upvotes={item.data.upvotedBy.length}
                isUpvoted={item.data.upvotedBy.includes(user?.id ?? '')}
                column={item.data.column}
                id={item.data.id}
                currentUserId={user?.id}
                creatorId={item.data.creatorId}
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
        {hiddenReflectionCount > 0 && (
          <ReflectingStack
            count={hiddenReflectionCount}
            ringStyle={ringStyle}
          />
        )}
      </div>
    </summary>
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

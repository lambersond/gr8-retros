'use client'

import { useMemo } from 'react'
import clsx from 'clsx'
import { ArrowBigUp, Vote, X } from 'lucide-react'
import { useBoardPermissions } from '@/providers/retro-board/board-settings'
import { CardGroupState, useBoardCards } from '@/providers/retro-board/cards'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export interface CardGroupVotingProps {
  group: CardGroupState
}

export function CardGroupVoting({ group }: Readonly<CardGroupVotingProps>) {
  const { cards: allCards } = useBoardCards()
  const { userPermissions } = useBoardPermissions()
  const { votes, canVote } = useBoardControlsState(s => ({
    votes: s.votes.filter(vote => vote === group.id),
    canVote: s.canVote,
  }))

  const { addMyVote, removeMyVote } = useBoardControlsActions(a => ({
    addMyVote: a.addMyVote,
    removeMyVote: a.removeMyVote,
  }))

  const timesVoted = votes.length
  const hasVoted = timesVoted > 0
  const hasVotingPermissions = userPermissions['voting.restricted.canVote']

  const memberCards = useMemo(
    () => group.cardIds.map(id => allCards[id]).filter(Boolean),
    [group.cardIds, allCards],
  )

  const totalUpvotes = useMemo(
    () => memberCards.reduce((sum, c) => sum + c.upvotedBy.length, 0),
    [memberCards],
  )

  const handleVotingClick = () => {
    if (canVote && hasVotingPermissions) {
      addMyVote(group.id)
    }
  }

  const handleRemoveVote = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeMyVote(group.id)
  }

  return (
    <summary
      data-id={group.id}
      data-kind='group'
      tabIndex={0}
      aria-label={hasVoted ? 'Group voted' : 'Vote for this group'}
      onClick={handleVotingClick}
      onKeyDown={e => e.key === 'Enter' && handleVotingClick()}
      className={clsx(
        'relative p-2 rounded flex flex-col gap-2 w-full transition-all select-none bg-page',
        {
          'border-border-dark shadow-primary/30 shadow-md ring-1.5 ring-primary/50':
            hasVoted,
          'border-border-light hover:shadow-md hover:border-primary':
            !hasVoted && hasVotingPermissions,
          'cursor-pointer border rounded shadow': hasVotingPermissions,
          'cursor-not-allowed': !hasVotingPermissions,
        },
      )}
      style={{
        boxShadow:
          '3px 3px 0 0 color-mix(in srgb, var(--color-card) 92%, black), 3px 3px 0 1px var(--color-border-light), 6px 6px 0 0 color-mix(in srgb, var(--color-card) 84%, black), 6px 6px 0 1px var(--color-border-light)',
      }}
    >
      {hasVoted && (
        <div className='absolute -top-2.5 -right-2.5 flex items-center gap-1 bg-primary text-text-primary text-xs font-semibold rounded-full px-2 py-0.5 shadow'>
          Voted
          {votes.map((voteId, index) => (
            <Vote className='size-3.5' key={`${voteId}-${index}`} />
          ))}
        </div>
      )}

      <div className='flex items-center gap-2 pointer-events-none'>
        <span className='text-sm font-semibold text-text-primary truncate'>
          {group.label}
        </span>
        <span className='text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full'>
          ×{memberCards.length}
        </span>
      </div>

      <div
        className={clsx(
          {
            'border-t': totalUpvotes > 0 || hasVoted,
          },
          'flex items-center justify-between pt-1 border-border-light',
        )}
      >
        {totalUpvotes > 0 && (
          <span className='text-xs text-text-secondary flex items-center gap-0.5'>
            <ArrowBigUp className='size-3.5' />
            {totalUpvotes} {totalUpvotes === 1 ? 'upvote' : 'upvotes'}
          </span>
        )}
        {hasVoted && (
          <button
            onClick={handleRemoveVote}
            className='ml-auto text-xs text-danger hover:text-danger/80 transition-all font-semibold px-1.5 py-0.5 rounded bg-danger/10 hover:bg-danger/20 active:bg-danger/30 flex items-center gap-0.5 cursor-pointer'
          >
            Clear <X className='size-3.5' />
          </button>
        )}
      </div>
    </summary>
  )
}

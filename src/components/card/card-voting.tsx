'use client'

import clsx from 'clsx'
import { ArrowBigUp, Vote, X } from 'lucide-react'
import { useBoardPermissions } from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls/selectors'
import type { CardVotingProps } from './types'

export function CardVoting({
  id,
  content,
  upvotes = 0,
}: Readonly<CardVotingProps>) {
  const { userPermissions } = useBoardPermissions()
  const { votes, canVote } = useBoardControlsState(s => ({
    votes: s.votes.filter(vote => vote === id),
    canVote: s.canVote,
  }))

  const timesVoted = votes.length
  const hasVoted = timesVoted > 0
  const hasVotingPermissions = userPermissions['voting.restricted.canVote']

  const { addMyVote, removeMyVote } = useBoardControlsActions(a => ({
    addMyVote: a.addMyVote,
    removeMyVote: a.removeMyVote,
  }))

  const handleVotingClick = () => {
    if (canVote && hasVotingPermissions) {
      addMyVote(id)
    }
  }

  const handleRemoveVote = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeMyVote(id)
  }

  return (
    <summary
      tabIndex={0}
      aria-label={votes.length > 0 ? 'Card voted' : 'Vote for this card'}
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
    >
      {hasVoted && (
        <div className='absolute -top-2.5 -right-2.5 flex items-center gap-1 bg-primary text-text-primary text-xs font-semibold rounded-full px-2 py-0.5 shadow'>
          Voted
          {votes.map((voteId, index) => (
            <Vote className='size-3.5' key={`${voteId}-${index}`} />
          ))}
        </div>
      )}

      <p className='pointer-events-none'>{content}</p>

      <div
        className={clsx(
          {
            'border-t': upvotes > 0 || hasVoted,
          },
          'flex items-center justify-between pt-1 border-border-light',
        )}
      >
        {upvotes > 0 && (
          <span className='text-xs text-text-secondary flex items-center gap-0.5'>
            <ArrowBigUp className='size-3.5' />
            {upvotes} {upvotes === 1 ? 'upvote' : 'upvotes'}
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

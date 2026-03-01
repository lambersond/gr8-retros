'use client'

import { CardDefault } from './card-default'
import { CardVoting } from './card-voting'
import { VotingState } from '@/enums'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import type { CardProps } from './types'

export function Card(props: Readonly<CardProps>) {
  const { votingState, votingResults } = useBoardControlsState(s => ({
    votingState: s.boardControls.voting.state,
    votingResults: s.boardControls.voting.results,
  }))

  if (votingState === VotingState.OPEN) {
    return (
      <CardVoting
        id={props.id}
        content={props.content}
        upvotes={props.upvotes}
      />
    )
  }

  return <CardDefault {...props} votes={votingResults[props.id]?.length} />
}

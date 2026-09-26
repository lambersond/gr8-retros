'use client'

import { CardDefault } from './card-default'
import { CardHidden } from './card-hidden'
import { CardVoting } from './card-voting'
import { GuidedPhase, VotingState } from '@/enums'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import type { CardProps } from './types'

export function Card(props: Readonly<CardProps>) {
  const { votingState, votingResults, guidedReflect } = useBoardControlsState(
    s => ({
      votingState: s.boardControls.voting.state,
      votingResults: s.boardControls.voting.results,
      guidedReflect:
        !!s.boardControls.guided?.isActive &&
        s.boardControls.guided.phase === GuidedPhase.REFLECT,
    }),
  )

  // During the guided Reflect phase, other people's cards are masked until the
  // facilitator reveals them by leaving Reflect; the author always sees their own.
  const isOthersCard =
    !!props.creatorId &&
    !!props.currentUserId &&
    props.creatorId !== props.currentUserId
  if (guidedReflect && isOthersCard) {
    return <CardHidden />
  }

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

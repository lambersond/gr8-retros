'use client'

import { useEffect } from 'react'
import { VotingState } from '@/enums'
import {
  BoardCardsInternalActionType,
  BoardCardsSortOptions,
  useBoardCardsDispatch,
} from '@/providers/retro-board/cards'
import { useBoardControlsState } from '@/providers/retro-board/controls'

/**
 * This component is responsible for handling any side effects
 *   that may occur on the retro board.
 * It is rendered at the root of the retro board so that it can
 *   listen to changes in the relevant providers and trigger side effects accordingly.
 */
export function SideEffectsHandler() {
  const cardDispatcher = useBoardCardsDispatch()
  const { votingState, votingResults } = useBoardControlsState(s => ({
    votingState: s.boardControls.voting.state,
    votingResults: s.boardControls.voting.results,
  }))

  useEffect(() => {
    switch (votingState) {
      case VotingState.IDLE: {
        cardDispatcher({
          type: BoardCardsInternalActionType.RESET_VOTING_RESULTS,
        })
        break
      }
      case VotingState.OPEN: {
        cardDispatcher({
          type: BoardCardsInternalActionType.SORT_CARDS,
          sort: BoardCardsSortOptions.BY_UPVOTES,
        })
        break
      }
      case VotingState.CLOSED: {
        cardDispatcher({
          type: BoardCardsInternalActionType.CLOSE_VOTING_RESULTS,
          votingResults: votingResults,
        })
        break
      }
      default: {
        break
      }
    }
  }, [votingState, votingResults])

  return <></>
}

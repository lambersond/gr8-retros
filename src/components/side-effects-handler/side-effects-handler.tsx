'use client'

import { useEffect, useRef } from 'react'
import { VotingState } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  BoardCardsInternalActionType,
  BoardCardsMessageType,
  BoardCardsSortOptions,
  useBoardCardsDispatch,
} from '@/providers/retro-board/cards'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import {
  useFacilitatorDiceActions,
  useFacilitatorDiceState,
} from '@/providers/retro-board/facilitator-dice'

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
          type: BoardCardsMessageType.SORT_CARDS,
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

  // Dice session listener — opens color picker for non-initiator participants
  const { activeSession } = useFacilitatorDiceState()
  const { submitRoll, submitDnr } = useFacilitatorDiceActions()
  const { user } = useAuth()
  const { openModal } = useModals()
  const lastSessionIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!activeSession) return
    if (activeSession.sessionId === lastSessionIdRef.current) return

    lastSessionIdRef.current = activeSession.sessionId

    if (activeSession.initiatorClientId === user.id) return
    if (!activeSession.participants[user.id]) return

    openModal('DiceColorPickerModal', { submitRoll, onDnr: submitDnr })
  }, [activeSession, user.id, openModal])

  return <></>
}

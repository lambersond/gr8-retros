'use client'

import { useEffect, useRef } from 'react'
import { VotingState } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  BoardCardsInternalActionType,
  BoardCardsMessageType,
  BoardCardsSortOptions,
  useBoardCards,
  useBoardCardsDispatch,
} from '@/providers/retro-board/cards'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'
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
  const { openModal, closeModal } = useModals()
  const lastSessionIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!activeSession) return
    if (activeSession.sessionId === lastSessionIdRef.current) return

    lastSessionIdRef.current = activeSession.sessionId

    if (activeSession.initiatorClientId === user.id) return
    if (!activeSession.participants[user.id]) return

    openModal('DiceColorPickerModal', { submitRoll, onDnr: submitDnr })
  }, [activeSession, user.id, openModal])

  // Close dice picker when the user's roll/dnr is resolved from another tab
  const myParticipant = activeSession?.participants[user.id]
  const wasResolvedRef = useRef(false)

  useEffect(() => {
    if (!activeSession || !myParticipant) {
      wasResolvedRef.current = false
      return
    }

    const isResolved = myParticipant.result !== undefined || myParticipant.dnr
    if (isResolved && !wasResolvedRef.current) {
      closeModal('DiceColorPickerModal')
    }
    wasResolvedRef.current = !!isResolved
  }, [activeSession, myParticipant, closeModal])

  // Inform users when voting is non-idle and the board appears empty after the
  // current voting filters are applied (e.g. all cards from a prior retro were
  // discussed and cleaned up, or voting was left CLOSED with no votes cast on
  // the remaining cards).
  const { cards, groups } = useBoardCards()
  const { resetVoting } = useBoardControlsActions(a => ({
    resetVoting: a.resetVoting,
  }))
  const hasShownVotingNotResetModalRef = useRef(false)

  useEffect(() => {
    if (hasShownVotingNotResetModalRef.current) return
    if (votingState === VotingState.IDLE) return

    const allCards = Object.values(cards)
    const allGroups = Object.values(groups)

    let hasVisibleItem = false
    if (votingState === VotingState.OPEN) {
      hasVisibleItem =
        allCards.some(card => !card.cardGroupId && !card.isDiscussed) ||
        allGroups.some(group => {
          const memberCards = group.cardIds.map(id => cards[id]).filter(Boolean)
          return (
            memberCards.length === 0 || memberCards.some(c => !c.isDiscussed)
          )
        })
    } else if (votingState === VotingState.CLOSED) {
      hasVisibleItem =
        allCards.some(card => !card.cardGroupId && (card.votes ?? 0) > 0) ||
        allGroups.some(group => {
          const memberVotes = group.cardIds
            .map(id => cards[id])
            .filter(Boolean)
            .reduce((sum, c) => sum + (c.votes ?? 0), 0)
          return (group.votes ?? 0) + memberVotes > 0
        })
    }
    if (hasVisibleItem) return

    hasShownVotingNotResetModalRef.current = true
    openModal('ConfirmModal', {
      title: 'Voting Still In Progress',
      message:
        'A voting session from a previous retro is still active and there are no cards to display. Would you like to reset voting now so you can start a new retro?',
      confirmButtonText: 'Reset Voting',
      cancelButtonText: 'Not Now',
      onConfirm: resetVoting,
    })
  }, [votingState, cards, groups, openModal, resetVoting])

  return <></>
}

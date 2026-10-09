'use client'

import {
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useAllVotesInPrompt } from '@/components/board-controls/voting/use-all-votes-in-prompt'
import { ModalStateCtx } from '@/components/modals/modal-provider'
import { VotingState } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import { useBoardSettings } from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

// The chosen facilitator's prompts in a normal (non-guided) session. Both live
// here so they share one rule: the chosen facilitator answers one prompt per
// voting round, never two.
//
// 1. "All votes are in" while voting is open offers to close the vote and,
//    when the board has Facilitator Mode, start discussing in the same write,
//    so "Start Discussions" below never follows it.
// 2. "Start Discussions" once voting closes without facilitation running. It
//    still covers a vote someone else closed (taking an unanswered prompt 1
//    down first; it waits for the slot), but not one the chosen facilitator
//    already turned down with "No, Leave me Alone": that suppresses both for
//    the rest of the round, re-arms included, since it asks not to be bothered.
//    The Start Discussions chip stays for when they're ready. Each prompt
//    takes itself down once it stops applying, so a stale one never holds
//    the other back to pop up the moment it's answered.
//
// A round ends when the vote is reset to idle or reopened. The decline is
// kept in this component, not on the board: it holds for this tab only and
// is forgotten on reload, like the guided prompt's "Stay in Voting".
export function useChosenFacilitatorPrompts() {
  const { votingState, isFacilitatorMode, chosenFacilitatorId } =
    useBoardControlsState(s => ({
      votingState: s.boardControls.voting.state,
      isFacilitatorMode: s.boardControls.facilitatorMode.isActive,
      chosenFacilitatorId: s.boardControls.chosenFacilitatorId,
    }))
  const { toggleFacilitatorMode, closeVotingAndDiscuss } =
    useBoardControlsActions(a => ({
      toggleFacilitatorMode: a.toggleFacilitatorMode,
      closeVotingAndDiscuss: a.closeVotingAndDiscuss,
    }))
  const { settings } = useBoardSettings()
  const { user } = useAuth()
  const { openModal, closeModal } = useModals()
  const confirmSlot = use(ModalStateCtx)?.ConfirmModal

  // Only open -> closed keeps the round going; any other change starts anew.
  const [roundState, setRoundState] = useState(votingState)
  const [hasDeclined, setHasDeclined] = useState(false)
  if (roundState !== votingState) {
    setRoundState(votingState)
    if (votingState !== VotingState.CLOSED) setHasDeclined(false)
  }
  const decline = useCallback(() => setHasDeclined(true), [])

  useAllVotesInPrompt({
    guided: false,
    enabled: !hasDeclined,
    buildPrompt: () => ({
      title: 'All votes are in',
      message: 'Discuss voted on topics?',
      confirmButtonText: 'Yes, Start Discussing',
      cancelButtonText: 'No, Leave me Alone',
      color: 'primary',
      onConfirm: closeVotingAndDiscuss,
      onCancel: decline,
    }),
  })

  const shouldOfferDiscussions =
    votingState === VotingState.CLOSED &&
    settings.facilitatorMode.enabled &&
    !isFacilitatorMode &&
    !!chosenFacilitatorId &&
    chosenFacilitatorId === user.id &&
    !hasDeclined

  // The offer's onConfirm is captured when it opens, so it reads these at
  // click time: toggleFacilitatorMode closes over its render's facilitation
  // state and would end a session someone else started, or start one over a
  // vote that's since been reopened.
  const latestOfferRef = useRef({
    shouldOfferDiscussions,
    toggleFacilitatorMode,
  })
  useLayoutEffect(() => {
    latestOfferRef.current = { shouldOfferDiscussions, toggleFacilitatorMode }
  }, [shouldOfferDiscussions, toggleFacilitatorMode])

  // The props of the offer on screen, which doubles as the one-shot flag.
  const offerRef = useRef<object | undefined>(undefined)

  useEffect(() => {
    if (!shouldOfferDiscussions) {
      // Take an unanswered offer down once it no longer applies (the vote was
      // reset or reopened, facilitation started, the facilitator changed), so
      // it can't start facilitation over an open vote and the next round's
      // "All votes are in" isn't left queued behind it. Like that prompt, only
      // close the shared slot while it still holds this offer.
      if (confirmSlot?.open && confirmSlot.props === offerRef.current) {
        closeModal('ConfirmModal')
      }
      offerRef.current = undefined
      return
    }
    if (offerRef.current) return
    // Wait for the slot rather than replace what's in it, including an "All
    // votes are in" being taken down because the vote closed under it; this
    // runs again once it's free.
    if (confirmSlot?.open) return
    const offer = {
      title: 'Start Discussions',
      message:
        'Voting is closed. As the chosen facilitator, would you like to start discussions and begin reviewing the cards?',
      confirmButtonText: 'Start Discussions',
      cancelButtonText: 'Later',
      onConfirm: () => {
        const latest = latestOfferRef.current
        if (latest.shouldOfferDiscussions) latest.toggleFacilitatorMode()
      },
    }
    offerRef.current = offer
    openModal('ConfirmModal', offer)
  }, [shouldOfferDiscussions, confirmSlot, openModal, closeModal])

  // A guided session starting drops PhaseIndicators (and this hook) without
  // the effect above seeing the offer stop applying; take it down with it.
  const confirmSlotRef = useRef(confirmSlot)
  useEffect(() => {
    confirmSlotRef.current = confirmSlot
  }, [confirmSlot])
  useEffect(
    () => () => {
      const slot = confirmSlotRef.current
      if (slot?.open && slot.props === offerRef.current) {
        closeModal('ConfirmModal')
      }
    },
    [closeModal],
  )
}

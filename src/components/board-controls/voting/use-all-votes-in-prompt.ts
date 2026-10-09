'use client'

import { use, useEffect, useLayoutEffect, useRef } from 'react'
import { useVotingProgress } from './use-voting-progress'
import { ModalStateCtx } from '@/components/modals/modal-provider'
import { VotingState } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import type { ConfirmModalProps } from '@/components/modals/confirm-modal/types'

// How long everyone has to stay in before the prompt opens. Board updates
// round-trip through Ably, so a confirmation just accepted (Next past "Not
// everyone has voted", End, or someone closing the vote) hasn't landed when
// its dialog closes. Waiting lets it land and cancel the prompt, rather than
// flash one up over a session that's moving on, whose confirm could even
// restart something just ended.
export const PROMPT_SETTLE_MS = 500

export type AllVotesInPrompt = Omit<ConfirmModalProps, 'open'>

// Tells the chosen facilitator, and only them, when the last vote lands while
// voting is open and offers to move the group on. Guided and normal sessions
// each mount their own copy (`guided` says which session it belongs to), and
// `enabled` narrows it further. It fires once each time everyone is in;
// someone resetting their votes or a new participant joining re-arms it.
// "Everyone" is the same count the voting progress shows. `buildPrompt` is
// read when the prompt opens, so it needn't be stable.
export function useAllVotesInPrompt({
  guided,
  enabled = true,
  buildPrompt,
}: Readonly<{
  guided: boolean
  enabled?: boolean
  buildPrompt: (votingMembers: number) => AllVotesInPrompt
}>) {
  const { isGuided, isVotingOpen, chosenFacilitatorId } = useBoardControlsState(
    s => ({
      isGuided: !!s.boardControls.guided?.isActive,
      isVotingOpen: s.boardControls.voting.state === VotingState.OPEN,
      chosenFacilitatorId: s.boardControls.chosenFacilitatorId,
    }),
  )
  const {
    user: { id: userId },
  } = useAuth()
  const { voted, votingMembers } = useVotingProgress()
  const { openModal, closeModal } = useModals()
  const confirmSlot = use(ModalStateCtx)?.ConfirmModal

  const shouldPrompt =
    enabled &&
    isGuided === guided &&
    isVotingOpen &&
    !!chosenFacilitatorId &&
    chosenFacilitatorId === userId &&
    votingMembers > 0 &&
    voted >= votingMembers

  const buildPromptRef = useRef(buildPrompt)
  useLayoutEffect(() => {
    buildPromptRef.current = buildPrompt
  }, [buildPrompt])

  // The props of the prompt on offer, which doubles as the one-shot flag.
  const promptRef = useRef<object | undefined>(undefined)

  useEffect(() => {
    if (!shouldPrompt) {
      // Take a still-open prompt down so it can't move the group on with a
      // vote missing, or offer to after someone else already has. The
      // ConfirmModal slot is shared app-wide (opening another modal replaces
      // this one), so only close it while it still holds this prompt.
      if (confirmSlot?.open && confirmSlot.props === promptRef.current) {
        closeModal('ConfirmModal')
      }
      promptRef.current = undefined
      return
    }
    if (promptRef.current) return
    // Wait out a confirmation that's already on screen rather than replacing
    // it; this runs again once that one closes.
    if (confirmSlot?.open) return

    const timeout = setTimeout(() => {
      const prompt = buildPromptRef.current(votingMembers)
      promptRef.current = prompt
      openModal('ConfirmModal', prompt)
    }, PROMPT_SETTLE_MS)
    return () => clearTimeout(timeout)
  }, [shouldPrompt, votingMembers, confirmSlot, openModal, closeModal])

  // Whatever mounts this can unmount while the prompt is up (ending a guided
  // session drops GuidedControls; starting one drops PhaseIndicators), so the
  // effect above never sees the condition go false. Take a prompt that's
  // still up down with it rather than leave a dead confirm on screen.
  const confirmSlotRef = useRef(confirmSlot)
  useEffect(() => {
    confirmSlotRef.current = confirmSlot
  }, [confirmSlot])
  useEffect(
    () => () => {
      const slot = confirmSlotRef.current
      if (slot?.open && slot.props === promptRef.current) {
        closeModal('ConfirmModal')
      }
    },
    [closeModal],
  )
}

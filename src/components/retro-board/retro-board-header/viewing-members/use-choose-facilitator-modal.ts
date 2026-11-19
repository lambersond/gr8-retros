import { use, useCallback, useEffect, useMemo, useRef } from 'react'
import { ModalStateCtx } from '@/components/modals/modal-provider'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import { useBoardMembers } from '@/providers/retro-board/board-settings'
import { useBoardControlsActions } from '@/providers/retro-board/controls'
import {
  allParticipantsRolled,
  getFacilitatorCandidates,
  useFacilitatorDiceActions,
  useFacilitatorDiceState,
  useRerollSelf,
} from '@/providers/retro-board/facilitator-dice'
import { useViewingMembers } from '@/providers/viewing-members'
import type { ModalMap } from '@/types'

type ChooseFacilitatorModalProps = Parameters<
  ModalMap['ChooseFacilitatorModal']
>[0]

/**
 * Opens the Choose Facilitator modal and keeps it current while it is open: a
 * member promoted (or arriving) while it is showing appears in the candidate
 * list without anyone having to close and reopen it.
 */
export function useChooseFacilitatorModal() {
  const { viewingMembers } = useViewingMembers()
  const boardMembers = useBoardMembers()
  const updateBoardControls = useBoardControlsActions(
    a => a.updateBoardControls,
  )
  const { user } = useAuth()
  const { openModal } = useModals()
  const { startSession, submitRoll, submitDnr } = useFacilitatorDiceActions()
  const { activeSession } = useFacilitatorDiceState()
  const rerollSelf = useRerollSelf()
  const isOpen = use(ModalStateCtx)?.ChooseFacilitatorModal?.open ?? false

  // A roll is "underway" until *everyone* has rolled a value. Anyone still
  // pending or DNR keeps it underway (a DNR no longer finalizes the roll). While
  // underway, the Roll action rerolls only the current user (joins the existing
  // roll) instead of restarting for everyone — use `allParticipantsRolled` here,
  // not `isSessionComplete`, so a DNR can't make a live roll look "done".
  const rollInProgress =
    !!activeSession && !allParticipantsRolled(activeSession)
  const myParticipant = activeSession?.participants[user.id]
  const canRoll = rollInProgress
    ? !!myParticipant && myParticipant.result === undefined
    : true
  const rollLabel = rollInProgress ? 'Reroll my die' : 'Roll for Facilitator'

  const candidates = useMemo(
    () =>
      getFacilitatorCandidates(viewingMembers, boardMembers).map(
        ({ clientId, name, image }) => ({ id: clientId, name, image }),
      ),
    [viewingMembers, boardMembers],
  )

  const props: ChooseFacilitatorModalProps = {
    candidates,
    rollDisabled: !canRoll,
    rollLabel,
    onSelect: clientId => {
      updateBoardControls({ chosenFacilitatorId: clientId })
    },
    onRoll: () => {
      if (rollInProgress) {
        rerollSelf()
        return
      }
      startSession()
      openModal('DiceColorPickerModal', { submitRoll, onDnr: submitDnr })
    },
  }

  // The modal renders outside the board's providers, so it only sees the props
  // it was opened with. Keep the latest props in a ref and re-push them only
  // when what the modal displays changes; keying the push on the data (not the
  // callbacks) means an unstable callback can't cause an open/re-render loop.
  const latestPropsRef = useRef(props)
  useEffect(() => {
    latestPropsRef.current = props
  })

  useEffect(() => {
    if (isOpen) openModal('ChooseFacilitatorModal', latestPropsRef.current)
  }, [isOpen, candidates, canRoll, rollLabel, openModal])

  return useCallback(
    () => openModal('ChooseFacilitatorModal', latestPropsRef.current),
    [openModal],
  )
}

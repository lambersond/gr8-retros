'use client'

import { useCallback } from 'react'
import { Crown } from 'lucide-react'
import Image from 'next/image'
import { Popover, Tooltip } from '@/components/common'
import { BoardRole } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import { hasMinimumRole } from '@/lib/roles'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'
import {
  allParticipantsRolled,
  useFacilitatorDiceActions,
  useFacilitatorDiceState,
  useRerollSelf,
} from '@/providers/retro-board/facilitator-dice'
import { useViewingMembers } from '@/providers/viewing-members'

export function ViewingMembers() {
  const { viewingMembers } = useViewingMembers()
  const chosenFacilitatorId = useBoardControlsState(
    s => s.boardControls.chosenFacilitatorId,
  )
  const updateBoardControls = useBoardControlsActions(
    a => a.updateBoardControls,
  )
  const { settings, isClaimed } = useBoardSettings()
  const { user } = useBoardPermissions()
  const { user: authUser } = useAuth()
  const { openModal } = useModals()
  const { startSession, submitRoll, submitDnr } = useFacilitatorDiceActions()
  const { activeSession } = useFacilitatorDiceState()
  const rerollSelf = useRerollSelf()

  const isFacilitatorModeEnabled = settings.facilitatorMode.enabled
  const canManageFacilitator = !isClaimed || user.hasFacilitator

  // A roll is "underway" until *everyone* has rolled a value. Anyone still
  // pending or DNR keeps it underway (a DNR no longer finalizes the roll). While
  // underway, the Roll action rerolls only the current user (joins the existing
  // roll) instead of restarting for everyone — use `allParticipantsRolled` here,
  // not `isSessionComplete`, so a DNR can't make a live roll look "done".
  const rollInProgress =
    !!activeSession && !allParticipantsRolled(activeSession)
  const myParticipant = activeSession?.participants[authUser.id]
  const canRoll = rollInProgress
    ? !!myParticipant && myParticipant.result === undefined
    : true
  const rollLabel = rollInProgress ? 'Reroll my die' : 'Roll for Facilitator'

  const facilitatorEntry =
    chosenFacilitatorId && viewingMembers[chosenFacilitatorId]
      ? ([chosenFacilitatorId, viewingMembers[chosenFacilitatorId]] as const)
      : undefined

  // The facilitator slot is present whenever facilitator mode is on. It shows a
  // mystery "?" placeholder (to everyone) until a facilitator is chosen, then
  // becomes that person's avatar + Crown. Only managers can click the
  // placeholder to open Choose Facilitator.
  const showPlaceholder = isFacilitatorModeEnabled && !facilitatorEntry

  const handleChooseFacilitator = useCallback(() => {
    const candidates = Object.entries(viewingMembers)
      .filter(([, member]) =>
        hasMinimumRole(BoardRole.FACILITATOR, member.role),
      )
      .map(([clientId, member]) => ({
        id: clientId,
        name: member.name,
        image: member.image,
      }))
    openModal('ChooseFacilitatorModal', {
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
    })
  }, [
    viewingMembers,
    openModal,
    updateBoardControls,
    startSession,
    submitRoll,
    submitDnr,
    rollInProgress,
    rerollSelf,
    canRoll,
    rollLabel,
  ])

  const otherEntries = Object.entries(viewingMembers).filter(
    ([clientId]) => clientId !== chosenFacilitatorId,
  )

  return (
    <div className='flex items-center gap-3 z-10'>
      {showPlaceholder && (
        <>
          {canManageFacilitator ? (
            <Tooltip title='Choose Facilitator' placement='bottom' asChild>
              <button
                type='button'
                onClick={handleChooseFacilitator}
                className='group flex items-center transition-all duration-200 hover:z-10 hover:scale-110 cursor-pointer'
              >
                <span className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-secondary text-sm font-bold text-secondary transition-colors group-hover:border-primary group-hover:text-primary'>
                  ?
                </span>
              </button>
            </Tooltip>
          ) : (
            <Tooltip title='Facilitator not chosen yet' placement='bottom'>
              <span className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-secondary text-sm font-bold text-secondary'>
                ?
              </span>
            </Tooltip>
          )}
          <div className='h-6 w-px bg-border-light' />
        </>
      )}
      {facilitatorEntry && (
        <>
          <Popover
            asChild
            trigger='contextmenu'
            placement='bottom-start'
            hidePopover={!canManageFacilitator}
            content={
              <div className='rounded-md border border-border-light bg-paper shadow-lg py-1'>
                <button
                  type='button'
                  onClick={handleChooseFacilitator}
                  className='block w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-hover cursor-pointer whitespace-nowrap'
                >
                  Re-choose Facilitator
                </button>
                <button
                  type='button'
                  onClick={() =>
                    updateBoardControls({ chosenFacilitatorId: undefined })
                  }
                  className='block w-full text-left px-3 py-1.5 text-sm text-danger hover:bg-hover cursor-pointer whitespace-nowrap'
                >
                  Clear Facilitator
                </button>
              </div>
            }
          >
            <div className='relative flex items-center transition-all duration-200 hover:z-10 hover:scale-110'>
              <Tooltip title={`${facilitatorEntry[1].name} (Facilitator)`}>
                <div className='relative'>
                  <Image
                    src={facilitatorEntry[1].image}
                    alt={facilitatorEntry[1].name}
                    width={32}
                    height={32}
                    className='w-8 h-8 rounded-full border-2 border-primary shadow-sm'
                  />
                  <Crown
                    className='absolute -top-2 -right-1 size-3.5 text-primary fill-primary'
                    strokeWidth={1.5}
                  />
                </div>
              </Tooltip>
            </div>
          </Popover>
          <div className='h-6 w-px bg-border-light' />
        </>
      )}
      <div className='flex items-center'>
        {otherEntries.map(([clientId, member]) => (
          <div
            key={clientId}
            className='relative flex items-center -ml-3 first:ml-0 transition-all duration-200 hover:z-10 hover:scale-110'
          >
            <Tooltip title={member.name}>
              <Image
                src={member.image}
                alt={member.name}
                width={32}
                height={32}
                className='w-8 h-8 rounded-full border-2 border-paper shadow-sm'
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  )
}

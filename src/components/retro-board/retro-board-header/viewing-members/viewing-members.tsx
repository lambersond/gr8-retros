'use client'

import { useCallback, useEffect, useState } from 'react'
import { Crown } from 'lucide-react'
import Image from 'next/image'
import { Tooltip } from '@/components/common'
import { D20Icon } from '@/components/common/icons'
import { BoardRole } from '@/enums'
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
import { useFacilitatorDiceActions } from '@/providers/retro-board/facilitator-dice'
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
  const { openModal } = useModals()
  const { startSession, submitRoll, submitDnr } = useFacilitatorDiceActions()

  const isFacilitatorModeEnabled = settings.facilitatorMode.enabled
  const canManageFacilitator = !isClaimed || user.hasFacilitator

  const facilitatorEntry =
    chosenFacilitatorId && viewingMembers[chosenFacilitatorId]
      ? ([chosenFacilitatorId, viewingMembers[chosenFacilitatorId]] as const)
      : undefined

  // Hide the dice when a chosen facilitator is currently present; surface it
  // again if the facilitator has left the board or none has been chosen.
  const showChooseFacilitator =
    isFacilitatorModeEnabled && canManageFacilitator && !facilitatorEntry

  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
  }>()

  useEffect(() => {
    if (!contextMenu) return
    const close = () => setContextMenu(undefined)
    document.addEventListener('click', close)
    document.addEventListener('contextmenu', close)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('contextmenu', close)
    }
  }, [contextMenu])

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
      onSelect: clientId => {
        updateBoardControls({ chosenFacilitatorId: clientId })
      },
      onRoll: () => {
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
  ])

  const otherEntries = Object.entries(viewingMembers).filter(
    ([clientId]) => clientId !== chosenFacilitatorId,
  )

  return (
    <div className='flex items-center gap-3 z-10'>
      {showChooseFacilitator && (
        <Tooltip title='Choose Facilitator' placement='bottom' asChild>
          <button
            type='button'
            onClick={handleChooseFacilitator}
            className='group flex items-center justify-center p-1 rounded cursor-pointer text-text-primary hover:bg-text-primary/10'
          >
            <D20Icon
              height={20}
              width={20}
              className='transition-transform duration-1000 ease-in-out group-hover:rotate-[360deg]'
            />
          </button>
        </Tooltip>
      )}
      {facilitatorEntry && (
        <>
          <div
            className='relative flex items-center transition-all duration-200 hover:z-10 hover:scale-110'
            onContextMenu={
              canManageFacilitator
                ? e => {
                    e.preventDefault()
                    setContextMenu({ x: e.clientX, y: e.clientY })
                  }
                : undefined
            }
          >
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
      {contextMenu && (
        <div
          className='fixed z-[1100] rounded-md border border-border-light bg-paper shadow-lg py-1'
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            type='button'
            onClick={() => {
              setContextMenu(undefined)
              handleChooseFacilitator()
            }}
            className='block w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-hover cursor-pointer whitespace-nowrap'
          >
            Re-choose Facilitator
          </button>
        </div>
      )}
    </div>
  )
}

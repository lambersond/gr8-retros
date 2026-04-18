'use client'

import { useMemo } from 'react'
import { Loader, Trophy, X } from 'lucide-react'
import { D20Icon } from '@/components/common/icons'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  FacilitatorDiceInternalAction,
  useFacilitatorDiceActions,
  useFacilitatorDiceDispatch,
  useFacilitatorDiceState,
  type DiceParticipant,
} from '@/providers/retro-board/facilitator-dice'

export function DiceGameLog() {
  const { activeSession } = useFacilitatorDiceState()
  const dispatch = useFacilitatorDiceDispatch()
  const { submitRoll, submitDnr } = useFacilitatorDiceActions()
  const { user } = useAuth()
  const { openModal } = useModals()

  const participants = useMemo(() => {
    if (!activeSession) return []
    return Object.values(activeSession.participants)
  }, [activeSession])

  type RollResult = {
    isComplete: boolean
    winner: DiceParticipant | undefined
  }

  const { isComplete, winner } = useMemo((): RollResult => {
    const noResult: RollResult = { isComplete: false, winner: undefined }
    if (!activeSession || participants.length === 0) return noResult

    const allResolved = participants.every(p => p.result !== undefined || p.dnr)
    if (!allResolved) return noResult

    let best: DiceParticipant | undefined
    for (const p of participants) {
      if (p.dnr) continue
      if (!best || (p.result ?? 0) > (best.result ?? 0)) {
        best = p
      }
    }
    return { isComplete: true, winner: best }
  }, [activeSession, participants])

  if (!activeSession) return

  const handleDismiss = () => {
    dispatch({ type: FacilitatorDiceInternalAction.CLEAR_SESSION })
  }

  const handleReroll = () => {
    dispatch({
      type: FacilitatorDiceInternalAction.CLEAR_DNR,
      clientId: user.id,
    })
    openModal('DiceColorPickerModal', { submitRoll, onDnr: submitDnr })
  }

  return (
    <div className='fixed bottom-4 right-4 z-[1100] w-72 rounded-xl border border-border-light bg-paper shadow-lg'>
      <div className='flex items-center justify-between border-b border-border-light px-4 py-3'>
        <h3 className='text-lg font-semibold text-text-primary'>
          Facilitator Roll
        </h3>
        <button
          onClick={handleDismiss}
          className='cursor-pointer text-text-primary/50 hover:text-text-primary'
        >
          <X size={18} />
        </button>
      </div>
      <div className='flex flex-col gap-2 p-4'>
        {participants.map(p => (
          <div
            key={p.clientId}
            className='flex items-center justify-between gap-2'
          >
            <div className='flex items-center gap-2 min-w-0'>
              {p.dnr && p.clientId === user.id && (
                <button
                  type='button'
                  onClick={handleReroll}
                  className='group cursor-pointer flex-shrink-0 text-text-secondary hover:text-primary'
                  title='Reroll'
                >
                  <D20Icon
                    height={18}
                    width={18}
                    className='transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]'
                  />
                </button>
              )}
              <span className='truncate text-sm text-text-primary'>
                {p.name}
              </span>
            </div>
            <ParticipantResult participant={p} />
          </div>
        ))}
        {isComplete && winner && (
          <div className='mt-2 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2'>
            <Trophy size={16} className='text-primary' />
            <span className='text-sm font-semibold text-primary'>
              {winner.name} is the facilitator!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function ParticipantResult({
  participant: p,
}: Readonly<{ participant: DiceParticipant }>) {
  if (p.dnr) {
    return (
      <span className='text-xs font-semibold text-text-secondary'>DNR</span>
    )
  }
  if (p.result === undefined) {
    return <Loader size={16} className='animate-spin text-text-primary/40' />
  }
  return (
    <span className='text-lg font-bold' style={{ color: p.color ?? 'inherit' }}>
      {p.result}
    </span>
  )
}

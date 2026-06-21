'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader, Trophy, X } from 'lucide-react'
import { D20Icon } from '@/components/common/icons'
import { useAuth } from '@/hooks/use-auth'
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
  FacilitatorDiceInternalAction,
  useFacilitatorDiceDispatch,
  useFacilitatorDiceState,
  useRerollSelf,
  type DiceParticipant,
} from '@/providers/retro-board/facilitator-dice'

export function DiceGameLog() {
  const { activeSession } = useFacilitatorDiceState()
  const dispatch = useFacilitatorDiceDispatch()
  const rerollSelf = useRerollSelf()
  const { user } = useAuth()
  const { isClaimed } = useBoardSettings()
  const { user: boardUser } = useBoardPermissions()
  const chosenFacilitatorId = useBoardControlsState(
    s => s.boardControls.chosenFacilitatorId,
  )
  const updateBoardControls = useBoardControlsActions(
    a => a.updateBoardControls,
  )

  const canManageFacilitator = !isClaimed || boardUser.hasFacilitator

  const participants = useMemo(() => {
    if (!activeSession) return []
    return Object.values(activeSession.participants)
  }, [activeSession])

  // The roll only finalizes automatically once everyone has rolled a value;
  // DNR/pending participants no longer auto-resolve the session.
  const allRolled = !!activeSession && allParticipantsRolled(activeSession)

  // Highest roller so far (participants without a numeric result — DNR and
  // pending — are skipped). Undefined until at least one person has rolled.
  const winner = useMemo<DiceParticipant | undefined>(() => {
    let best: DiceParticipant | undefined
    for (const p of participants) {
      if (p.result === undefined) continue
      if (!best || p.result > (best.result ?? 0)) best = p
    }
    return best
  }, [participants])

  // Remember the facilitator chosen when this session first appeared so a stale
  // prior facilitator (e.g. on a re-choose) isn't read as this roll's winner.
  const sessionStartRef = useRef<{
    sessionId?: string
    chosenAtStart?: string
  }>({})
  if (
    activeSession &&
    sessionStartRef.current.sessionId !== activeSession.sessionId
  ) {
    sessionStartRef.current = {
      sessionId: activeSession.sessionId,
      chosenAtStart: chosenFacilitatorId,
    }
  }

  // Locally-ended session id, so the manager who clicks End Roll sees the panel
  // finalize instantly even if the winner equals the prior facilitator.
  const [endedSessionId, setEndedSessionId] = useState<string | undefined>()

  // Auto-pick the highest roller once everyone has rolled (guarded once per
  // session). Runs on every client; writes are idempotent and this keeps the
  // pick working even if the initiator has left the board.
  const autoPickedRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (!activeSession || !allRolled || !winner) return
    if (autoPickedRef.current === activeSession.sessionId) return
    autoPickedRef.current = activeSession.sessionId
    updateBoardControls({ chosenFacilitatorId: winner.clientId })
  }, [activeSession, allRolled, winner, updateBoardControls])

  const celebrated = useMemo<DiceParticipant | undefined>(() => {
    const chosen = participants.find(p => p.clientId === chosenFacilitatorId)
    if (chosen) return chosen
    return allRolled ? winner : undefined
  }, [participants, chosenFacilitatorId, allRolled, winner])

  if (!activeSession) return

  const chosenIsParticipant =
    !!chosenFacilitatorId &&
    participants.some(p => p.clientId === chosenFacilitatorId)

  // The session is "finalized" once everyone rolled (auto), this client ended
  // it, or a (new) facilitator has been chosen from its participants.
  const finalized =
    allRolled ||
    endedSessionId === activeSession.sessionId ||
    (chosenIsParticipant &&
      chosenFacilitatorId !== sessionStartRef.current.chosenAtStart)

  // Managers can end a roll early while people are still pending/DNR; disabled
  // until at least one person has rolled.
  const showEndRoll =
    canManageFacilitator && participants.length > 0 && !allRolled && !finalized

  const handleEndRoll = () => {
    if (!winner) return
    setEndedSessionId(activeSession.sessionId)
    updateBoardControls({ chosenFacilitatorId: winner.clientId })
  }

  const handleDismiss = () => {
    dispatch({ type: FacilitatorDiceInternalAction.CLEAR_SESSION })
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
                  onClick={rerollSelf}
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
        {finalized && celebrated && (
          <div className='mt-2 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2'>
            <Trophy size={16} className='text-primary' />
            <span className='text-sm font-semibold text-primary'>
              {celebrated.name} is the facilitator!
            </span>
          </div>
        )}
        {showEndRoll && (
          <button
            type='button'
            onClick={handleEndRoll}
            disabled={!winner}
            className='mt-2 rounded-xl bg-primary/85 py-2 px-4 text-center text-sm font-bold uppercase text-text-primary hover:bg-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary/85'
          >
            End Roll
          </button>
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

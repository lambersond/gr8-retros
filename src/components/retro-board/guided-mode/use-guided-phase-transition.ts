'use client'

import { useCallback, useLayoutEffect, useRef } from 'react'
import { GuidedPhase } from '@/enums'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

// Moves the guided session from one phase to another using the session as it
// is when called, not as it was when the caller rendered. Confirm modals keep
// the onConfirm they were opened with, but setGuidedPhase closes over that
// render's board controls, and entering Discuss tallies (and rewrites)
// collectedVotes from them, so votes cast while a modal sat open were dropped.
// `from` turns a confirm that lands after someone else already moved the
// session on into a no-op rather than re-applying a phase.
export function useGuidedPhaseTransition() {
  const phase = useBoardControlsState(
    s => s.boardControls.guided?.phase ?? GuidedPhase.REFLECT,
  )
  const setGuidedPhase = useBoardControlsActions(a => a.setGuidedPhase)
  const latestRef = useRef<
    { phase: GuidedPhase; setGuidedPhase: typeof setGuidedPhase } | undefined
  >(undefined)

  useLayoutEffect(() => {
    latestRef.current = { phase, setGuidedPhase }
    // The header unmounts the guided controls the moment someone ends the
    // session, so the ref stops tracking while a confirm can still be on
    // screen. Clearing it keeps that confirm from re-activating the session.
    return () => {
      latestRef.current = undefined
    }
  }, [phase, setGuidedPhase])

  return useCallback((from: GuidedPhase, to: GuidedPhase) => {
    const latest = latestRef.current
    if (latest?.phase !== from) return
    latest.setGuidedPhase(to)
  }, [])
}

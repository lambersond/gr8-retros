'use client'

import { useSyncExternalStore } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import { useBoardControlsState } from '@/providers/retro-board/controls'

// Whether a facilitator who isn't the chosen facilitator has turned the remote
// on for themselves. It's a personal view preference, so it lives in this
// browser (across boards and tabs) rather than in the shared board state.
const STORAGE_KEY = 'facilitator-remote:shown'
const listeners = new Set<() => void>()
// Keeps the toggle working for this page when storage is unavailable.
let fallback = false

function readShown() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? stored === 'true' : fallback
  } catch {
    return fallback
  }
}

function writeShown(shown: boolean) {
  fallback = shown
  try {
    localStorage.setItem(STORAGE_KEY, String(shown))
  } catch {
    // Storage unavailable (private mode / disabled): the choice just won't
    // outlive this page.
  }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener()
  }
  globalThis.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    globalThis.removeEventListener('storage', onStorage)
  }
}

function getBlockedReason(
  feature: 'timer' | 'music',
  enabled: boolean,
  canControl: boolean,
): string | undefined {
  if (!enabled) return `The ${feature} is turned off in board settings`
  return canControl ? undefined : `Only Facilitators can control the ${feature}`
}

// Who sees the facilitator remote. The chosen facilitator always does; any
// other facilitator (the same people who get the Facilitator Actions menu) can
// show or hide it for themselves. Either way it only renders when the timer or
// music can actually be controlled.
export function useFacilitatorRemote() {
  const { user, userPermissions } = useBoardPermissions()
  const {
    user: { id: userId },
  } = useAuth()
  const { settings, isClaimed } = useBoardSettings()
  const chosenFacilitatorId = useBoardControlsState(
    s => s.boardControls.chosenFacilitatorId,
  )
  const isShown = useSyncExternalStore(subscribe, readShown, () => false)

  const isChosenFacilitator =
    !!chosenFacilitatorId && chosenFacilitatorId === userId
  const timerBlocked = getBlockedReason(
    'timer',
    settings.timer.enabled,
    userPermissions['timer.restricted.canControl'],
  )
  const musicBlocked = getBlockedReason(
    'music',
    settings.music.enabled,
    userPermissions['music.restricted.canControl'],
  )
  const isUsable = !timerBlocked || !musicBlocked
  const canToggle =
    isUsable && !isChosenFacilitator && (!isClaimed || user.hasFacilitator)

  return {
    isVisible: isChosenFacilitator ? isUsable : canToggle && isShown,
    canToggle,
    isShown,
    setShown: writeShown,
    timerBlocked,
    musicBlocked,
    timerEnabled: settings.timer.enabled,
  }
}

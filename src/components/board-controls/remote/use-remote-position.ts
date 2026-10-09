'use client'

import { useMemo, useRef, useState, useSyncExternalStore } from 'react'
import {
  DEFAULT_POSITION,
  EDGE_MARGIN_REM,
  parsePosition,
  toPosition,
  toPositionStyle,
  type RemoteBounds,
  type RemotePosition,
} from './utils'

// Where this facilitator has moved the remote to. Like whether it's shown,
// it's a personal view preference, so it lives in this browser (across boards
// and tabs) rather than in the shared board state. Nothing stored (or an empty
// string) means the default corner.
const STORAGE_KEY = 'facilitator-remote:position'
const listeners = new Set<() => void>()
// Keeps moves working for this page when storage is unavailable.
let fallback = ''

// The raw string is the snapshot: a primitive, so it compares equal between
// reads and useSyncExternalStore doesn't loop. It's parsed once per change.
function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? fallback
  } catch {
    return fallback
  }
}

// Omitting the position clears it, back to the default corner.
function writeStored(position?: RemotePosition) {
  const raw = position ? JSON.stringify(position) : ''
  try {
    if (raw) localStorage.setItem(STORAGE_KEY, raw)
    else localStorage.removeItem(STORAGE_KEY)
    // Storage has it, so drop the fallback: left over, it would stand in for
    // the key once another tab resets (removes) it, and this tab wouldn't
    // follow the reset.
    fallback = ''
  } catch {
    // Storage unavailable (private mode / disabled): the position just won't
    // outlive this page.
    fallback = raw
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

const NUDGE_STEP = 10
const NUDGE_STEP_LARGE = 50
const NUDGE_DIRECTIONS: Partial<Record<string, readonly [number, number]>> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

type DragSession = {
  pointerId: number
  // Where on the remote it was grabbed, so it moves with the pointer instead
  // of snapping its corner to it.
  grabX: number
  grabY: number
  bounds: RemoteBounds
  // Unset until the pointer actually moves, so a plain press (or each half of
  // a double-click) saves nothing.
  position?: RemotePosition
}

// Where the remote is right now, and the space it can move in.
function measure(remote: HTMLElement) {
  const rect = remote.getBoundingClientRect()
  const root = document.documentElement
  const rem = Number.parseFloat(getComputedStyle(root).fontSize) || 16
  const bounds: RemoteBounds = {
    width: rect.width,
    height: rect.height,
    // The fixed-position containing block, i.e. the window minus scrollbars.
    viewportWidth: root.clientWidth,
    viewportHeight: root.clientHeight,
    margin: EDGE_MARGIN_REM * rem,
  }
  return { rect, bounds }
}

// Lets the facilitator put the remote anywhere on screen. Its handle drags it
// (mouse, touch or pen), arrow keys nudge it (Shift for bigger steps), and
// double-click or Home sends it back to the bottom-right corner. Mid-drag the
// position is local state; it's saved when the remote is dropped.
export function useRemotePosition() {
  const remoteRef = useRef<HTMLFieldSetElement>(null)
  // The server has no storage, so it (and hydration) render the default
  // corner, same as a browser that has never moved the remote.
  const stored = useSyncExternalStore(subscribe, readStored, () => '')
  const storedPosition = useMemo(() => parsePosition(stored), [stored])
  const [dragPosition, setDragPosition] = useState<RemotePosition>()
  const dragRef = useRef<DragSession>(undefined)

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    // Main button, first finger or pen tip only, so a right-click or a second
    // finger doesn't pick it up.
    if (!event.isPrimary || event.button !== 0 || !remoteRef.current) return
    const { rect, bounds } = measure(remoteRef.current)
    // Captured so the drag keeps up when the pointer outruns the handle.
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      grabX: event.clientX - rect.left,
      grabY: event.clientY - rect.top,
      bounds,
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (drag?.pointerId !== event.pointerId) return
    drag.position = toPosition(
      event.clientX - drag.grabX,
      event.clientY - drag.grabY,
      drag.bounds,
    )
    setDragPosition(drag.position)
  }

  // Also handles pointercancel: the remote stays wherever it got to.
  const handleDrop = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (drag?.pointerId !== event.pointerId) return
    dragRef.current = undefined
    if (drag.position) writeStored(drag.position)
    setDragPosition(undefined)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // Leave browser and OS shortcuts (e.g. Alt+Left for back) alone.
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'Home') {
      event.preventDefault()
      writeStored()
      return
    }
    const direction = NUDGE_DIRECTIONS[event.key]
    if (!direction || !remoteRef.current) return
    // Moves the remote instead of scrolling the page.
    event.preventDefault()
    const { rect, bounds } = measure(remoteRef.current)
    const step = event.shiftKey ? NUDGE_STEP_LARGE : NUDGE_STEP
    writeStored(
      toPosition(
        rect.left + direction[0] * step,
        rect.top + direction[1] * step,
        bounds,
      ),
    )
  }

  return {
    remoteRef,
    style: toPositionStyle(dragPosition ?? storedPosition ?? DEFAULT_POSITION),
    isDragging: !!dragPosition,
    handleProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handleDrop,
      onPointerCancel: handleDrop,
      onKeyDown: handleKeyDown,
      onDoubleClick: () => writeStored(),
    },
  }
}

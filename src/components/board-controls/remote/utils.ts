import { clamp01 } from '@/utils/clamp01'
import type { CSSProperties } from 'react'

// Where the facilitator remote sits, as how far across (x) and down (y) the
// window it is: 0 puts it against the left / top margin, 1 against the right /
// bottom one. Fractions rather than pixels mean any value keeps the whole
// remote on screen, and it holds its relative spot as the window resizes.
export type RemotePosition = Readonly<{ x: number; y: number }>

// The bottom-right corner: where the remote starts, and where a reset sends it.
export const DEFAULT_POSITION: RemotePosition = { x: 1, y: 1 }

// Gap kept between the remote and the window's edges (Tailwind's `4` step).
export const EDGE_MARGIN_REM = 1

// Positions are stored, so keep them short; 1/10000 of the travel is well
// under a pixel on any screen.
const PRECISION = 10_000

// The pixel space a drag or nudge happens in, measured from the real remote
// since its size changes at the lg breakpoint.
export type RemoteBounds = Readonly<{
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
  margin: number
}>

// Reads a stored position. Anything that isn't one (hand-edited, truncated,
// left by some other version) is ignored, so the remote falls back to its
// default corner instead of landing somewhere odd.
export function parsePosition(raw: string): RemotePosition | undefined {
  if (!raw) return
  try {
    const { x, y } = JSON.parse(raw) ?? {}
    if (Number.isFinite(x) && Number.isFinite(y)) {
      return { x: clamp01(x), y: clamp01(y) }
    }
  } catch {
    // Not JSON: same as no position.
  }
}

// Where the remote ends up when its top-left corner is asked to go to
// (left, top) in pixels, clamped so it stays inside the margins.
export function toPosition(
  left: number,
  top: number,
  bounds: RemoteBounds,
): RemotePosition {
  return {
    x: toFraction(left, bounds.width, bounds.viewportWidth, bounds.margin),
    y: toFraction(top, bounds.height, bounds.viewportHeight, bounds.margin),
  }
}

function toFraction(
  start: number,
  size: number,
  viewport: number,
  margin: number,
) {
  const travel = viewport - size - 2 * margin
  // A window too small to move around in leaves it in the default corner.
  if (travel <= 0) return 1
  return Math.round(clamp01((start - margin) / travel) * PRECISION) / PRECISION
}

// Placed in CSS rather than pixels, so it needs no measuring or resize
// listener: left / top put the remote's corner that fraction of the way across
// the space inside the margins, and translate pulls it back by the same
// fraction of its own size. At 1, 1 that's exactly bottom-4 right-4.
export function toPositionStyle({ x, y }: RemotePosition): CSSProperties {
  const margin = `${EDGE_MARGIN_REM}rem`
  return {
    left: `calc(${margin} + ${x} * (100% - 2 * ${margin}))`,
    top: `calc(${margin} + ${y} * (100% - 2 * ${margin}))`,
    translate: `${-x * 100}% ${-y * 100}%`,
  }
}

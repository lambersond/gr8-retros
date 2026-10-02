import type { Placement } from '@floating-ui/react'

export type TooltipProps = {
  children: React.ReactNode
  title?: React.ReactNode
  placement?: Placement
  asChild?: boolean
  contentContainerClasses?: string
  // Position against this element instead of the one that receives hover and
  // focus, e.g. an upright icon inside a rotated button whose bounding box is
  // much larger than what's visible.
  anchor?: Element | null
}

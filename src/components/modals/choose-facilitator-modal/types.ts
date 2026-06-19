import type { ModalProps } from '../types'

export interface ChooseFacilitatorModalProps extends ModalProps {
  onSelect: (clientId: string) => void
  onRoll: () => void
  candidates: Array<{ id: string; name: string; image: string }>
  /** Disable the roll button (e.g. the user already rolled in an active roll). */
  rollDisabled?: boolean
  /** Label for the roll button; defaults to "Roll for Facilitator". */
  rollLabel?: string
}

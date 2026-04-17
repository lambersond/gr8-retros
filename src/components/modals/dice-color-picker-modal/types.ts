import type { ModalProps } from '../types'

export interface DiceColorPickerModalProps extends ModalProps {
  submitRoll: (color: string) => void
  onDnr?: () => void
}

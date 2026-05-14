import type { ModalProps } from '../types'

export interface ChooseFacilitatorModalProps extends ModalProps {
  onSelect: (clientId: string) => void
  onRoll: () => void
  candidates: Array<{ id: string; name: string; image: string }>
}

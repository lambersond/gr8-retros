import type { CardGroupState } from '@/providers/retro-board/cards'
import type { Card } from '@/types'

export type FacilitatorItem =
  | { kind: 'card'; data: Card }
  | { kind: 'group'; data: CardGroupState }

export type ColumnInfo = {
  label: string
  emoji: string | undefined
  titleBg: string
  titleText: string
}

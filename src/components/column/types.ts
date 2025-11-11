import type { Card, ColumnType } from '@/types'

export type ColumnProps = {
  type: ColumnType
  cards?: Card[]
  onAdd: VoidFunction
  currentUserId?: string
}

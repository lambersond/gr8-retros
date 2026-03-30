import type { Column } from '@/types'

export type CustomizeBoardColumnsModalProps = {
  open?: boolean
  title?: string
  initialColumns: Column[]
  onSave?: (updatedColumns: Column[], originalColumns: Column[]) => Promise<void> | void
}

// TEMP
export type ColorMode = 'light' | 'dark'

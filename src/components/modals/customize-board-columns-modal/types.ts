import type { PaymentTier } from '@/enums'
import type { Column } from '@/types'

export type CustomizeBoardColumnsModalProps = {
  open?: boolean
  title?: string
  initialColumns: Column[]
  boardTier: PaymentTier
  onSave?: (updatedColumns: Column[], originalColumns: Column[]) => Promise<void> | void
}

// TEMP
export type ColorMode = 'light' | 'dark'

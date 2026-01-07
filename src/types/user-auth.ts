import type { BoardRole } from '@/types'

export type WithUserUser = {
  id: string
  name: string
  boards: Record<string, { settingsId: string; role: BoardRole }> | undefined
}

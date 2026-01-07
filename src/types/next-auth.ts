import type { BoardRole } from '@/types'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      boards: Record<string, { settingsId: string; role: BoardRole }>
    } & DefaultSession['user']
  }

  interface JWT {
    id: string
    boards: Record<string, { settingsId: string; role: BoardRole }>
  }
}

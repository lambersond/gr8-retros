import type { BoardRole } from '@/enums'

type PresenceUser = {
  name: string
  image: string
  isAuthenticated: boolean
  role: BoardRole
}

export type ViewingMembers = Record<string, PresenceUser>

export type ViewingMembersContextType = {
  viewingMembers: ViewingMembers
}

export type ViewingMembersProviderProps = {
  channelName: string
  children: React.ReactNode
}

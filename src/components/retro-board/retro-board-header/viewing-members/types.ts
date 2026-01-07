type PresenceUser = {
  name: string
  image: string
}

export type ViewingMembers = Record<string, PresenceUser>

export type PresenceEvent = {
  action: string
  clientId: string
  data: PresenceUser
}

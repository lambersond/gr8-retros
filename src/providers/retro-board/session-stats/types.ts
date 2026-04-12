export type SessionParticipant = {
  name: string
  image?: string
}

export type DiscussionTiming = {
  itemId: string
  itemKind: 'card' | 'group'
  label: string
  column: string
  durationMs: number
}

export type PersistedSessionStats = {
  boardId: string
  sessionStartedAt: number
  lastSavedAt: number
  participants: SessionParticipant[]
  discussionTimings: Record<string, DiscussionTiming>
}

export type SessionStatsContextType = {
  sessionStartedAt: number
  participants: SessionParticipant[]
  discussionTimings: Record<string, DiscussionTiming>
}

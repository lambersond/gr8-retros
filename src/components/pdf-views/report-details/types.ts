export type ReportDetailsDocumentProps = {
  title?: string
  date?: Date
  summary?: string
  stats: ReportDetailsStats
  columns: ReportDetailsColumn[]
  sessionData?: ReportSessionData
}

export type ReportDetailsColumn = {
  styles: ReportDetailsColumnStyles
  settings: ReportDetailsColumnSettings
  cards: ReportDetailsColumnCard[]
}

export type ReportDetailsStats = {
  totalCards: number
  totalGroups: number
  totalDiscussed: number
  totalVotes: number
  totalActions: number
  completedActions: number
  totalComments: number
}

export type ReportSessionParticipant = {
  name: string
  image?: string
}

export type ReportDiscussionTiming = {
  label: string
  column: string
  durationMs: number
}

export type ReportSessionData = {
  sessionStartedAt: number
  participants: ReportSessionParticipant[]
  discussionTimings: ReportDiscussionTiming[]
}

type ReportDetailsColumnSettings = {
  position: number
  emoji: string
  name: string
}

type ReportDetailsColumnStyles = {
  bgColor: string
  borderColor: string
  textColor: string
}

export type ReportDetailsColumnCard = {
  id: string
  title: string
  votes: number
  isDiscussed: boolean
  submittedBy?: string
  groupLabel?: string
  comments: ReportDetailsCardComment[]
  actionItems: ReportDetailsCardActionItem[]
}

type ReportDetailsCardComment = {
  id: string
  content: string
  author: string
}

type ReportDetailsCardActionItem = {
  id: string
  content: string
  completed: boolean
  assignedTo?: string
}

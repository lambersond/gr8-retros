export type ReportDetailsDocumentProps = {
  title?: string
  date?: Date
  stats: ReportDetailsStats
  columns: ReportDetailsColumn[]
}

export type ReportDetailsColumn = {
  styles: ReportDetailsColumnStyles
  settings: ReportDetailsColumnSettings
  cards: ReportDetailsColumnCard[]
}

export type ReportDetailsStats = {
  totalCards: number
  totalVotes: number
  totalActions: number
  completedActions: number
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

type ReportDetailsColumnCard = {
  id: string
  title: string
  votes: number
  submittedBy?: string
  actionItems: ReportDetailsCardActionItem[]
}

type ReportDetailsCardActionItem = {
  id: string
  content: string
  completed: boolean
  assignedTo?: string
}

import { DEFAULT_COLUMN_SETTINGS } from '@/constants'
import type { ReportDetailsColumn } from './report-details'
import type { ColumnType } from '@/types'

type InputData = Record<ColumnType, { cards: any[] }>

export function formatColumnDataForPDF(data: InputData) {
  const columnData = {} as Record<ColumnType, ReportDetailsColumn>
  for (const [columnKey, columnValue] of Object.entries(data)) {
    const columnSettings = DEFAULT_COLUMN_SETTINGS[columnKey as ColumnType]
    columnData[columnKey as ColumnType] = {
      cards: columnValue.cards.map(card => ({
        id: card.id,
        title: card.content,
        submittedBy: card.createdBy,
        votes: card.upvotedBy.length,
        actionItems: card.actionItems.map((item: any) => ({
          id: item.id,
          content: item.content,
          completed: item.isDone,
          assignedTo: item.assignedTo?.name || 'Unassigned',
        })),
      })),
      settings: {
        position: columnSettings.position,
        emoji: columnSettings.emoji,
        name: columnSettings.title,
      },
      styles: {
        bgColor: columnSettings.printColor,
        borderColor: columnSettings.printBorderColor,
        textColor: columnSettings.printTextColor,
      },
    }
  }

  return Object.values(columnData).toSorted(
    (a, b) => a.settings.position - b.settings.position,
  ) satisfies ReportDetailsColumn[]
}

export function calculateStatsForPDF(data: InputData) {
  const columns = Object.entries(data)
  let totalCards = 0
  let totalVotes = 0
  let totalActions = 0
  let completedActions = 0

  for (const [, columnData] of columns) {
    for (const card of columnData.cards) {
      totalCards++
      totalVotes += card.upvotedBy.length
      for (const item of card.actionItems) {
        totalActions++
        if (item.isDone) completedActions++
      }
    }
  }

  return { totalCards, totalVotes, totalActions, completedActions }
}

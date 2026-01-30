import { DEFAULT_COLUMN_SETTINGS } from '@/constants'
import { BoardCardsState } from '@/providers/retro-board/cards/types'
import type { ReportDetailsColumn } from './report-details'
import type { ColumnType } from '@/types'

export function formatColumnDataForPDF(data: BoardCardsState) {
  const columnData = {} as Record<ColumnType, ReportDetailsColumn>

  for (const card of Object.values(data.cards)) {
    // only fixed column types are supported atm
    const columnType = card.column as ColumnType
    if (!columnData[columnType]) {
      const columnSettings = DEFAULT_COLUMN_SETTINGS[columnType]
      columnData[columnType] = {
        cards: [],
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
    columnData[columnType].cards.push({
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
    })
  }

  return Object.values(columnData).toSorted(
    (a, b) => a.settings.position - b.settings.position,
  ) satisfies ReportDetailsColumn[]
}

export function calculateStatsForPDF(data: BoardCardsState) {
  let totalCards = 0
  let totalVotes = 0
  let totalActions = 0
  let completedActions = 0

  for (const card of Object.values(data.cards)) {
    totalCards++
    totalVotes += card.upvotedBy.length
    totalActions += card.actionItems.length
    for (const ai of card.actionItems) {
      if (ai.isDone) completedActions++
    }
  }

  return { totalCards, totalVotes, totalActions, completedActions }
}

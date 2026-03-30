import { BoardCardsState } from '@/providers/retro-board/cards/types'
import { toColumnConfigMap } from '@/utils/column-utils'
import type { ReportDetailsColumn } from './report-details'
import type { Column } from '@/types'

export function formatColumnDataForPDF(
  data: BoardCardsState,
  columns: Column[],
) {
  const columnStyles = toColumnConfigMap(columns)
  const columnData = {} as Record<string, ReportDetailsColumn>

  for (const card of Object.values(data.cards)) {
    const columnType = card.column

    if (!columnStyles[columnType]) {
      continue
    }

    if (!columnData[columnType]) {
      const columnStyle = columnStyles[columnType]
      columnData[columnType] = {
        cards: [],
        settings: {
          position: columnStyle?.index || 0,
          emoji: columnStyle?.emoji || '',
          name: columnStyle?.label || '',
        },
        styles: {
          bgColor: columnStyle.light.bg,
          borderColor: columnStyle.light.border,
          textColor: columnStyle.light.titleText,
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

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

  // Build group label lookup
  const groupLabels: Record<string, string> = {}
  for (const group of Object.values(data.groups)) {
    if (group.label) {
      groupLabels[group.id] = group.label
    }
  }

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
      votes: card.upvotedBy?.length ?? 0,
      isDiscussed: card.isDiscussed,
      groupLabel: card.cardGroupId ? groupLabels[card.cardGroupId] : undefined,
      comments: (card.comments ?? []).map(c => ({
        id: c.id,
        content: c.content,
        author: c.createdBy,
      })),
      actionItems: (card.actionItems ?? []).map(item => ({
        id: item.id,
        content: item.content,
        completed: item.isDone,
        assignedTo: item.assignedTo?.name ?? 'Unassigned',
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
  let totalComments = 0
  let totalDiscussed = 0

  for (const card of Object.values(data.cards)) {
    totalCards++
    totalVotes += card.upvotedBy?.length ?? 0
    totalComments += card.comments?.length ?? 0
    totalActions += card.actionItems?.length ?? 0
    if (card.isDiscussed) totalDiscussed++
    for (const ai of card.actionItems ?? []) {
      if (ai.isDone) completedActions++
    }
  }

  const totalGroups = Object.keys(data.groups ?? {}).length

  return {
    totalCards,
    totalGroups,
    totalDiscussed,
    totalVotes,
    totalActions,
    completedActions,
    totalComments,
  }
}

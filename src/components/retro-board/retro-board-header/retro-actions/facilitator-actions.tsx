import { useCallback, useMemo, useState } from 'react'
import {
  BrushCleaning,
  Download,
  Eraser,
  Eye,
  EyeOff,
  Hammer,
  Loader,
  Sparkles,
} from 'lucide-react'
import { LabeledTriggerButton } from './labeled-trigger-button'
import { useRetroActions } from './use-retro-actions'
import { useFacilitatorRemote } from '@/components/board-controls'
import {
  Menu,
  Popover,
  type Option as MenuOption,
  type GroupOption as MenuGroupOption,
} from '@/components/common'
import { PdfIcon } from '@/components/common/icons'
import {
  calculateStatsForPDF,
  formatColumnDataForPDF,
} from '@/components/pdf-views/utils'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import { useBoardCards } from '@/providers/retro-board/cards'
import { useBoardColumns } from '@/providers/retro-board/columns'
import { useSessionStats } from '@/providers/retro-board/session-stats'
import { generateSessionSummary } from '@/server/ai/generate-session-summary'
import type { ReportSessionData } from '@/components/pdf-views/report-details'

// The hammer menu: clearing cards, exports, and the quick controls toggle.
// Split from RetroActions so the guided header can offer it on its own, without
// the Sorts/Filters that guided mode leaves out.
export function FacilitatorActions({ id }: Readonly<{ id: string }>) {
  const { handleClearBoard, handleClearCompleted } = useRetroActions(id)
  const { isClaimed, isAiSummaryEnabled } = useBoardSettings()
  const { user } = useBoardPermissions()
  const { openModal } = useModals()
  const data = useBoardCards()
  const { columns } = useBoardColumns()
  const sessionStats = useSessionStats()
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const {
    canToggle: canToggleRemote,
    isShown: isRemoteShown,
    setShown: setRemoteShown,
  } = useFacilitatorRemote()

  const showFacilitatorActions = !isClaimed || user.hasFacilitator

  // Report data is built when an export is picked rather than on every render,
  // since this menu re-renders on every card change.
  const handleExportReport = useCallback(() => {
    openModal('PDFPreviewerModal', {
      title: 'Export Report Details',
      type: 'ReportDetails',
      columns: formatColumnDataForPDF(data, columns),
      stats: calculateStatsForPDF(data),
    })
  }, [data, columns, openModal])

  const handleExportAiSummary = useCallback(async () => {
    const stats = calculateStatsForPDF(data)
    const formattedData = formatColumnDataForPDF(data, columns)
    setIsGeneratingSummary(true)
    let summary: string | undefined

    try {
      const columnLabels: Record<string, string> = {}
      for (const col of columns) {
        columnLabels[col.columnType] = col.label
      }

      const summaryCards = Object.values(data.cards).map(card => ({
        content: card.content,
        column: card.column,
        votes: card.upvotedBy.length,
        isDiscussed: card.isDiscussed,
        comments: (card.comments ?? []).map(c => c.content),
        actionItems: (card.actionItems ?? []).map(ai => ({
          content: ai.content,
          completed: ai.isDone,
        })),
        groupLabel: card.cardGroupId
          ? data.groups[card.cardGroupId]?.label
          : undefined,
      }))

      summary = await generateSessionSummary(summaryCards, columnLabels, {
        totalCards: stats.totalCards,
        totalGroups: stats.totalGroups,
        totalDiscussed: stats.totalDiscussed,
        totalComments: stats.totalComments,
        totalActionItems: stats.totalActions,
        incompleteActionItems: stats.totalActions - stats.completedActions,
        hadVoting: stats.totalVotes > 0,
        totalVotes: stats.totalVotes,
      })
    } catch {
      // Continue without summary on failure
    } finally {
      setIsGeneratingSummary(false)
    }

    const sessionData: ReportSessionData = {
      sessionStartedAt: sessionStats.sessionStartedAt,
      participants: sessionStats.participants,
      discussionTimings: Object.values(sessionStats.discussionTimings),
    }

    openModal('PDFPreviewerModal', {
      title: 'Export AI Summary Report',
      type: 'ReportDetails',
      columns: formattedData,
      stats,
      summary,
      sessionData,
    })
  }, [data, columns, sessionStats, openModal])

  const hammerOptions = useMemo(() => {
    const exportOptions: MenuOption[] = [
      {
        label: 'Report Details',
        icon: <PdfIcon height={16} width={17} className='-mr-1' />,
        onClick: handleExportReport,
      },
    ]

    if (isAiSummaryEnabled && !isGeneratingSummary) {
      exportOptions.push({
        label: 'AI Summary Report',
        icon: <Sparkles size={16} />,
        onClick: handleExportAiSummary,
      })
    }

    if (isAiSummaryEnabled && isGeneratingSummary) {
      exportOptions.push({
        label: 'Generating Summary...',
        icon: <Loader size={16} className='animate-spin' />,
        onClick: () => {},
      })
    }

    const options: (MenuOption | MenuGroupOption)[] = [
      {
        label: 'Clear Only Completed Items',
        onClick: handleClearCompleted,
        icon: <BrushCleaning size={16} />,
      },
      {
        key: 'export-group',
        label: 'Export Options',
        showHeader: true,
        icon: <Download size={16} />,
        options: exportOptions,
      },
    ]

    if (user.hasAdmin) {
      options.unshift({
        label: 'Clear All Cards',
        onClick: handleClearBoard,
        color: 'danger',
        icon: <Eraser size={16} />,
      })
    }

    // A facilitator who isn't the chosen facilitator can bring up the remote
    // (quick controls) for themselves. The chosen facilitator always has it.
    if (canToggleRemote) {
      options.unshift({
        label: isRemoteShown ? 'Hide Quick Controls' : 'Show Quick Controls',
        icon: isRemoteShown ? <EyeOff size={16} /> : <Eye size={16} />,
        onClick: () => setRemoteShown(!isRemoteShown),
      })
    }
    return options
  }, [
    user,
    canToggleRemote,
    isRemoteShown,
    setRemoteShown,
    handleClearBoard,
    handleClearCompleted,
    handleExportReport,
    handleExportAiSummary,
    isAiSummaryEnabled,
    isGeneratingSummary,
  ])

  if (!showFacilitatorActions) return

  return (
    <Popover
      asChild
      modal
      placement='bottom-start'
      content={<Menu options={hammerOptions} />}
    >
      <LabeledTriggerButton label='Facilitator Actions' icon={Hammer} />
    </Popover>
  )
}

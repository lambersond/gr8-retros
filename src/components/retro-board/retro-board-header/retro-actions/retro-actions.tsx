import { useCallback, useMemo, useState } from 'react'
import {
  ArrowDownWideNarrow,
  BrushCleaning,
  Download,
  Eraser,
  Funnel,
  Hammer,
  Loader,
  Sparkles,
} from 'lucide-react'
import { useRetroActions } from './use-retro-actions'
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
import { VotingState } from '@/enums'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import {
  BoardCardsFilterOptions,
  BoardCardsSortOptions,
  useBoardCards,
} from '@/providers/retro-board/cards'
import { useBoardColumns } from '@/providers/retro-board/columns'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import { useSessionStats } from '@/providers/retro-board/session-stats'
import { generateSessionSummary } from '@/server/ai/generate-session-summary'
import type { ReportSessionData } from '@/components/pdf-views/report-details'

export function RetroActions({ id }: Readonly<{ id: string }>) {
  const {
    handleClearBoard,
    handleClearCompleted,
    handleSortCardsBy,
    handleFilterCardsBy,
  } = useRetroActions(id)
  const { hasVotingResults } = useBoardControlsState(s => ({
    hasVotingResults: s.boardControls.voting.state === VotingState.CLOSED,
  }))
  const { isClaimed, isAiSummaryEnabled } = useBoardSettings()
  const { openModal } = useModals()
  const data = useBoardCards()
  const stats = calculateStatsForPDF(data)
  const { columns } = useBoardColumns()
  const formattedData = formatColumnDataForPDF(data, columns)
  const sessionStats = useSessionStats()
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const { user } = useBoardPermissions()

  const showFacilitatorActions = !isClaimed || user.hasFacilitator
  const showFilterButton = hasVotingResults

  const handleExportReport = useCallback(() => {
    openModal('PDFPreviewerModal', {
      title: 'Export Report Details',
      type: 'ReportDetails',
      columns: formattedData,
      stats,
    })
  }, [formattedData, stats, openModal])

  const handleExportAiSummary = useCallback(async () => {
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
  }, [data, columns, formattedData, stats, sessionStats, openModal])

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
    return options
  }, [
    user,
    handleClearBoard,
    handleClearCompleted,
    handleExportReport,
    handleExportAiSummary,
    isAiSummaryEnabled,
    isGeneratingSummary,
  ])

  const sortOptions = useMemo(() => {
    const options = [
      {
        label: 'Sort by Discussed Status',
        onClick: () => handleSortCardsBy(BoardCardsSortOptions.BY_DISCUSSED),
      },
      {
        label: 'Sort by Most Upvotes',
        onClick: () => handleSortCardsBy(BoardCardsSortOptions.BY_UPVOTES),
      },
      {
        label: 'Sort by Most Comments',
        onClick: () =>
          handleSortCardsBy(BoardCardsSortOptions.BY_COMMENT_COUNT),
      },
      {
        label: 'Sort by Most Action Items',
        onClick: () =>
          handleSortCardsBy(BoardCardsSortOptions.BY_ACTION_ITEM_COUNT),
      },
    ]

    if (showFilterButton) {
      options.push({
        label: 'Sort by Most Votes',
        onClick: () => handleSortCardsBy(BoardCardsSortOptions.BY_VOTES),
      })
    }
    return options
  }, [handleSortCardsBy, showFilterButton])

  return (
    <div className='flex gap-2 z-10'>
      {showFilterButton && (
        <Popover
          asChild
          modal
          placement='bottom-start'
          content={
            <Menu
              options={[
                {
                  label: 'Show All Cards',
                  onClick: () =>
                    handleFilterCardsBy(BoardCardsFilterOptions.ALL),
                },
                {
                  label: 'Show Only Cards With Votes',
                  onClick: () =>
                    handleFilterCardsBy(BoardCardsFilterOptions.WITH_VOTES),
                },
                {
                  label: 'Show Cards Without Votes',
                  onClick: () =>
                    handleFilterCardsBy(BoardCardsFilterOptions.WITHOUT_VOTES),
                },
              ]}
            />
          }
        >
          <LabeledTriggerButton label='Filters' icon={Funnel} />
        </Popover>
      )}
      <Popover
        asChild
        modal
        placement='bottom-start'
        content={<Menu options={sortOptions} />}
      >
        <LabeledTriggerButton label='Sorts' icon={ArrowDownWideNarrow} />
      </Popover>
      {showFacilitatorActions && (
        <Popover
          asChild
          modal
          placement='bottom-start'
          content={<Menu options={hammerOptions} />}
        >
          <LabeledTriggerButton label='Facilitator Actions' icon={Hammer} />
        </Popover>
      )}
    </div>
  )
}

type LabeledTriggerButtonProps = {
  label: string
  icon: React.ElementType
  onClick?: () => void
}

function LabeledTriggerButton({
  label,
  icon: Icon,
  onClick,
  ...rest
}: Readonly<LabeledTriggerButtonProps>) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer text-text-primary hover:bg-text-primary/10'
      {...rest}
    >
      <span className='hidden md:inline text-sm font-medium'>{label}</span>
      <Icon className='size-5' />
    </button>
  )
}

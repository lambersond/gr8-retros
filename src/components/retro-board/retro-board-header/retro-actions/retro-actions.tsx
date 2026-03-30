import { useMemo } from 'react'
import {
  ArrowDownWideNarrow,
  BrushCleaning,
  Download,
  Eraser,
  Funnel,
  Hammer,
  Settings,
} from 'lucide-react'
import { useRetroActions } from './use-retro-actions'
import { IconButton, Menu, Popover } from '@/components/common'
import { PdfIcon } from '@/components/common/icons'
import {
  calculateStatsForPDF,
  formatColumnDataForPDF,
} from '@/components/pdf-views/utils'
import { VotingState } from '@/enums'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'
import {
  BoardCardsFilterOptions,
  BoardCardsSortOptions,
  useBoardCards,
} from '@/providers/retro-board/cards'
import { useBoardColumns } from '@/providers/retro-board/columns'
import { useBoardControlsState } from '@/providers/retro-board/controls'

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
  const { openSidebar } = useBoardSettingsActions()
  const { isClaimed } = useBoardSettings()
  const { isAuthenticated } = useAuth()
  const { openModal } = useModals()
  const data = useBoardCards()
  const stats = calculateStatsForPDF(data)
  const { columns } = useBoardColumns()
  const formattedData = formatColumnDataForPDF(data, columns)

  const { user } = useBoardPermissions()

  const showAdminActions = !isClaimed || user.hasFacilitator
  const showSettingsButton = (isAuthenticated && !isClaimed) || user.hasMember
  const showFilterButton = hasVotingResults

  const hammerOptions = useMemo(() => {
    const options = [
      {
        label: 'Clear Only Completed Items',
        onClick: handleClearCompleted,
        icon: <BrushCleaning size={16} />,
      },
      {
        key: 'export-group',
        label: 'Export Options',
        divider: true,
        showHeader: true,
        icon: <Download size={16} />,
        options: [
          {
            label: 'Report Details',
            icon: <PdfIcon height={16} width={17} className='-mr-1' />,
            onClick: () =>
              openModal('PDFPreviewerModal', {
                title: 'Export Report Details',
                type: 'ReportDetails',
                columns: formattedData,
                stats,
              }),
          },
        ],
      },
    ] as any[]

    if (user.hasAdmin) {
      options.splice(1, 0, {
        label: 'Clear All Cards',
        onClick: handleClearBoard,
        color: 'danger',
        icon: <Eraser size={16} />,
      })
    }
    return options
  }, [user, handleClearBoard, handleClearCompleted])

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
          <IconButton icon={Funnel} intent='text-primary' size='lg' />
        </Popover>
      )}
      <Popover
        modal
        placement='bottom-start'
        content={<Menu options={sortOptions} />}
      >
        <IconButton icon={ArrowDownWideNarrow} intent='text-primary' size='lg' />
      </Popover>
      {showAdminActions && (
        <Popover
          modal
          placement='bottom-start'
          content={<Menu options={hammerOptions} />}
        >
          <IconButton icon={Hammer} intent='text-primary' size='lg' />
        </Popover>
      )}
      {showSettingsButton && (
        <IconButton
          icon={Settings}
          intent='text-primary'
          size='lg'
          onClick={openSidebar}
        />
      )}
    </div>
  )
}

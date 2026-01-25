import { useMemo } from 'react'
import {
  ArrowDownWideNarrow,
  BrushCleaning,
  Download,
  Eraser,
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
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'
import { useBoardCards } from '@/providers/retro-board/cards'

export function RetroActions({ id }: Readonly<{ id: string }>) {
  const { handleClearBoard, handleClearCompleted, handleSortCardsBy } =
    useRetroActions(id)
  const { openSidebar } = useBoardSettingsActions()
  const { isClaimed } = useBoardSettings()
  const { isAuthenticated } = useAuth()
  const { openModal } = useModals()
  const data = useBoardCards()
  const stats = calculateStatsForPDF(data)
  const formattedData = formatColumnDataForPDF(data)

  const { user } = useBoardPermissions()

  const showAdminActions = !isClaimed || user.hasFacilitator
  const showSettingsButton = (isAuthenticated && !isClaimed) || user.hasMember

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

  return (
    <div className='flex gap-2 z-10'>
      <Popover
        modal
        placement='bottom-start'
        content={
          <Menu
            options={[
              {
                label: 'Sort by Discussed Status',
                onClick: () => handleSortCardsBy('byDiscussed'),
              },
              {
                label: 'Sort by Most Votes',
                onClick: () => handleSortCardsBy('byUpvotes'),
              },
              {
                label: 'Sort by Most Comments',
                onClick: () => handleSortCardsBy('byComments'),
              },
              {
                label: 'Sort by Most Action Items',
                onClick: () => handleSortCardsBy('byActionItems'),
              },
            ]}
          />
        }
      >
        <IconButton icon={ArrowDownWideNarrow} intent='primary' size='lg' />
      </Popover>
      {showAdminActions && (
        <Popover
          modal
          placement='bottom-start'
          content={<Menu options={hammerOptions} />}
        >
          <IconButton icon={Hammer} intent='primary' size='lg' />
        </Popover>
      )}
      {showSettingsButton && (
        <IconButton
          icon={Settings}
          intent='primary'
          size='lg'
          onClick={openSidebar}
        />
      )}
    </div>
  )
}

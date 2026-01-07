import {
  ArrowDownWideNarrow,
  BrushCleaning,
  Eraser,
  Hammer,
  Settings,
} from 'lucide-react'
import { useRetroActions } from './use-retro-actions'
import { IconButton, Menu, Popover } from '@/components/common'
import { useAuth } from '@/hooks/use-auth'
import { useBoardSettingsActions } from '@/providers/retro-board/board-settings'

export function RetroActions({ id }: Readonly<{ id: string }>) {
  const { handleClearBoard, handleClearCompleted, handleSortCardsBy } =
    useRetroActions(id)
  const { openSidebar } = useBoardSettingsActions()
  const { isAuthenticated } = useAuth()

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
      <Popover
        modal
        placement='bottom-start'
        content={
          <Menu
            options={[
              {
                label: 'Clear Only Completed Items',
                onClick: handleClearCompleted,
                icon: <BrushCleaning size={16} />,
              },
              {
                label: 'Clear All Cards',
                onClick: handleClearBoard,
                color: 'danger',
                icon: <Eraser size={16} />,
              },
            ]}
          />
        }
      >
        <IconButton icon={Hammer} intent='primary' size='lg' />
      </Popover>
      <div className='hidden'>
        {isAuthenticated && (
          <IconButton
            icon={Settings}
            intent='primary'
            size='lg'
            onClick={openSidebar}
          />
        )}
      </div>
    </div>
  )
}

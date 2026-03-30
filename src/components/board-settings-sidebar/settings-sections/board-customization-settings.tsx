import { useChannel } from 'ably/react'
import { ChevronRight, Paintbrush } from 'lucide-react'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import { BoardCardsMessageType } from '@/providers/retro-board/cards'
import {
  BoardColumnsMessageType,
  useBoardColumns,
} from '@/providers/retro-board/columns'
import { saveBoardColumns } from '@/server/board-columns/board-columns-service'
import type { UpdateBoardColumn } from '@/server/board-columns/types'

export function BoardCustomizationSettings() {
  const { openModal } = useModals()
  const { columns } = useBoardColumns()
  const { id, boardId } = useBoardSettings()
  const { publish } = useChannel(boardId)
  const {
    user: { hasFacilitator },
  } = useBoardPermissions()

  const onClick = () => {
    openModal('CustomizeBoardColumnsModal', {
      initialColumns: columns,
      async onSave(updatedColumns, originalColumns) {
        const data = await saveBoardColumns(
          updatedColumns as unknown as UpdateBoardColumn[],
          originalColumns as unknown as UpdateBoardColumn[],
          id,
          boardId,
        )
        if (data.cardColumnMigrations.length > 0) {
          publish({
            data: {
              type: BoardCardsMessageType.UPDATE_CARDS_COLUMN,
              payload: { columnCorrections: data.cardColumnMigrations },
            },
          })
        }

        publish({
          data: {
            type: BoardColumnsMessageType.UPDATE_COLUMNS,
            payload: data.columns,
          },
        })
      },
    })
  }

  if (!hasFacilitator) return

  return (
    <button
      className='group w-full justify-start gap-2 rounded-lg border border-border-light bg-paper px-4 py-5 text-text-primary transition-all flex items-center max-h-12 hover:border-primary-new cursor-pointer'
      onClick={onClick}
    >
      <Paintbrush className='size-5 text-primary-new' />
      Customize your board
      <ChevronRight className='size-4 text-text-secondary ml-auto group-hover:text-primary-new' />
    </button>
  )
}

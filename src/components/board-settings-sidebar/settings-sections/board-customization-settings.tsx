import { useChannel } from 'ably/react'
import { ChevronRight, Lock, Paintbrush } from 'lucide-react'
import { PaymentTierBadge } from '@/components/badges'
import { Tooltip } from '@/components/common'
import { PaymentTier } from '@/enums'
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
  const { id, boardId, boardTier } = useBoardSettings()
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

  if (boardTier === PaymentTier.FREE) {
    return (
      <button
        className='relative group w-full justify-start gap-2 rounded-lg border border-border-light bg-paper px-4 py-5 text-text-primary transition-all flex items-center max-h-12 cursor-not-allowed'
        disabled
      >
        <Paintbrush className='size-5 text-text-secondary' />
        <p className='opacity-50'>Customize your board</p>
        <ChevronRight className='size-4 text-text-secondary ml-auto' />
        <Tooltip
          title={
            <span className='text-sm text-text-primary flex items-center gap-1'>
              This feature is available for{' '}
              <PaymentTierBadge tier={PaymentTier.SUPPORTER} redirectToPlans />{' '}
              plans and above.
            </span>
          }
          asChild
        >
          <Lock className='size-10 text-primary-new absolute top-0.5 right-2.5 rounded-lg bg-paper p-2' />
        </Tooltip>
      </button>
    )
  }

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

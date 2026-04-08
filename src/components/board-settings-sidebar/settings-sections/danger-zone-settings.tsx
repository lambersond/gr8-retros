import { useChannel } from 'ably/react'
import { TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BoardRole } from '@/enums'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardMembers,
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import { BoardSettingsMessageType } from '@/providers/retro-board/board-settings/enums'
import { BoardColumnsMessageType } from '@/providers/retro-board/columns'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export function DangerZoneSettings() {
  const { openModal } = useModals()
  const router = useRouter()
  const { id, boardId } = useBoardSettings()
  const members = useBoardMembers()
  const {
    user: { hasOwner },
  } = useBoardPermissions()
  const { publish } = useChannel(boardId)
  const isFacilitatorModeActive = useBoardControlsState(
    s => s.boardControls.facilitatorMode.isActive,
  )
  const updateBoardControls = useBoardControlsActions(
    a => a.updateBoardControls,
  )

  if (!hasOwner) return

  const admins = members.filter(m => m.role === BoardRole.ADMIN)

  const handleTransferBoard = () => {
    openModal('TransferBoardModal', {
      admins,
      settingsId: id,
      onTransfer: (result: { deactivateFacilitatorMode: boolean }) => {
        if (result.deactivateFacilitatorMode && isFacilitatorModeActive) {
          updateBoardControls({ facilitatorMode: { isActive: false } })
        }
      },
    })
  }

  const handleResetSettings = () => {
    openModal('ConfirmModal', {
      title: 'Reset Settings',
      message: (
        <div className='flex flex-col gap-2 text-danger'>
          <p>This will reset your board to its default state:</p>
          <ul className='list-disc pl-5 text-sm'>
            <li>Columns reset to standard theme</li>
            <li>All permissions reset to defaults</li>
            <li>Join links cleared</li>
            <li>All members demoted to Member role</li>
          </ul>
          <p>Cards and action items will not be affected.</p>
          <p>Are you sure?</p>
        </div>
      ),
      confirmButtonText: 'Yes, Reset',
      color: 'danger',
      onConfirm: () => {
        fetch(`/api/board-settings/${id}/reset`, { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            if (data.error) return

            if (isFacilitatorModeActive) {
              updateBoardControls({ facilitatorMode: { isActive: false } })
            }

            publish({
              data: {
                type: BoardSettingsMessageType.UPDATE_BOARD_SETTINGS,
                payload: data.settings,
              },
            })
            publish({
              data: {
                type: BoardColumnsMessageType.UPDATE_COLUMNS,
                payload: data.columns,
              },
            })
            publish({
              data: {
                type: BoardSettingsMessageType.REVOKE_INVITATION_LINK,
              },
            })
          })
      },
    })
  }

  const handleDeleteBoard = () => {
    openModal('ConfirmModal', {
      title: 'Delete Board',
      message: (
        <div className='flex flex-col gap-2 text-danger'>
          <p>
            Deleting this board will remove all cards, comments, and action
            items.
          </p>
          <p>Are you sure you want to delete this board?</p>
          <p>This action cannot be undone.</p>
        </div>
      ),
      confirmButtonText: 'Yes, Delete',
      color: 'danger',
      onConfirm: () => {
        fetch(`/api/board-settings/${id}`, {
          method: 'DELETE',
        }).then(() => {
          router.push('/')
        })
      },
    })
  }

  return (
    <div className='p-4 border-2 border-danger/45 rounded-lg bg-danger/20 text-danger flex flex-col gap-2'>
      <div className='flex gap-2'>
        <TriangleAlert className='size-6 text-danger' />
        <p className='font-bold text-lg'>Danger Zone</p>
      </div>
      <button
        className='bg-danger/90 text-white font-bold px-4 py-2 rounded cursor-pointer hover:bg-danger'
        onClick={handleResetSettings}
      >
        Reset Settings
      </button>
      {admins.length > 0 && (
        <button
          className='bg-danger/90 text-white font-bold px-4 py-2 rounded cursor-pointer hover:bg-danger'
          onClick={handleTransferBoard}
        >
          Transfer Board
        </button>
      )}
      <button
        className='bg-danger/90 text-white font-bold px-4 py-2 rounded cursor-pointer hover:bg-danger'
        onClick={handleDeleteBoard}
      >
        Delete Board
      </button>
    </div>
  )
}

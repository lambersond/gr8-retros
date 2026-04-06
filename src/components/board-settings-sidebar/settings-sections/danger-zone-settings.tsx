import { TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BoardRole } from '@/enums'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardMembers,
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'
import {
  useBoardControlsActions,
  useBoardControlsState,
} from '@/providers/retro-board/controls'

export function DangerZoneSettings() {
  const { openModal } = useModals()
  const router = useRouter()
  const { id } = useBoardSettings()
  const members = useBoardMembers()
  const {
    user: { hasOwner },
  } = useBoardPermissions()
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

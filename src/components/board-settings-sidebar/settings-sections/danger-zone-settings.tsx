import { TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useModals } from '@/hooks/use-modals'
import {
  useBoardPermissions,
  useBoardSettings,
} from '@/providers/retro-board/board-settings'

export function DangerZoneSettings() {
  const { openModal } = useModals()
  const router = useRouter()
  const { id } = useBoardSettings()
  const {
    user: { hasOwner },
  } = useBoardPermissions()

  if (!hasOwner) return

  const handleDeleteBoard = () => {
    openModal('ConfirmModal', {
      title: 'Delete Board',
      message: (
        <div className='flex flex-col gap-2 text-red-950'>
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
    <div className='p-4 border-2 border-danger/45 rounded-lg bg-red-100/30 text-red-900 flex flex-col gap-2'>
      <div className='flex gap-2'>
        <TriangleAlert className='size-6 text-danger' />
        <p className='font-bold text-lg'>Danger Zone</p>
      </div>
      <button
        className='bg-danger/90 text-white font-bold px-4 py-2 rounded cursor-pointer hover:bg-danger'
        onClick={handleDeleteBoard}
      >
        Delete Board
      </button>
    </div>
  )
}

import { useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/common'
import { useModals } from '@/hooks/use-modals'
import type { TransferBoardModalProps } from './types'

export function TransferBoardModal({
  admins = [],
  settingsId,
  open = true,
  onTransfer,
}: Readonly<TransferBoardModalProps>) {
  const { closeModal } = useModals()
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null)
  const [isTransferring, setIsTransferring] = useState(false)

  const onClose = () => {
    setSelectedAdminId(null)
    closeModal('TransferBoardModal')
  }

  const handleTransfer = async () => {
    if (!selectedAdminId) return
    setIsTransferring(true)

    try {
      const resp = await fetch(
        `/api/board-settings/${settingsId}/transfer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newOwnerId: selectedAdminId }),
        },
      )

      if (!resp.ok) return

      const result = await resp.json()
      onTransfer(result)
      onClose()
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <Modal title='Transfer Board' isOpen={open} onClose={onClose}>
      <div className='flex flex-col gap-4'>
        <p className='text-text-primary'>
          Select an admin to transfer board ownership to. You will be demoted to
          admin.
        </p>

        <div className='flex flex-col'>
          {admins.map(admin => (
            <button
              key={admin.user.id}
              type='button'
              className={`p-3 flex items-center gap-3 rounded-lg cursor-pointer border-2 transition-colors ${
                selectedAdminId === admin.user.id
                  ? 'border-primary bg-info/10'
                  : 'border-transparent hover:bg-hover'
              }`}
              onClick={() => setSelectedAdminId(admin.user.id)}
            >
              {admin.user.image && (
                <Image
                  src={admin.user.image}
                  alt={admin.user.name}
                  width={32}
                  height={32}
                  className='rounded-full'
                />
              )}
              <p className='text-lg text-text-primary'>{admin.user.name}</p>
            </button>
          ))}
          {admins.length === 0 && (
            <p className='text-text-secondary text-sm italic'>
              No admins available to transfer to.
            </p>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-border-light border-2 border-border-light hover:text-text-primary/70 hover:border-text-primary/70 cursor-pointer rounded-lg text-lg font-bold uppercase'
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedAdminId || isTransferring}
            className='px-4 py-2 bg-danger/90 text-white/90 hover:text-white hover:bg-danger cursor-pointer rounded-lg text-lg font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isTransferring ? 'Transferring...' : 'Transfer'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

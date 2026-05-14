'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dropdown, Modal } from '@/components/common'
import { D20Icon } from '@/components/common/icons'
import { useModals } from '@/hooks/use-modals'
import type { ChooseFacilitatorModalProps } from './types'

export function ChooseFacilitatorModal({
  open = true,
  onSelect,
  onRoll,
  candidates = [],
}: Readonly<ChooseFacilitatorModalProps>) {
  const { closeModal } = useModals()
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const onClose = () => {
    closeModal('ChooseFacilitatorModal')
  }

  const handleConfirm = () => {
    if (!selectedId) return
    onSelect(selectedId)
    onClose()
  }

  const handleRoll = () => {
    onClose()
    onRoll()
  }

  const options = candidates.map(candidate => ({
    id: candidate.id,
    label: (
      <span className='flex items-center gap-2'>
        <Image
          src={candidate.image}
          alt={candidate.name}
          width={24}
          height={24}
          className='size-6 rounded-full'
        />
        {candidate.name}
      </span>
    ),
    searchText: candidate.name,
    value: candidate.id,
  }))

  return (
    <Modal title='Choose Facilitator' isOpen={open} onClose={onClose}>
      <div className='flex flex-col gap-4 p-2'>
        {candidates.length === 0 ? (
          <p className='text-text-secondary text-sm italic'>
            No eligible members are currently viewing the board.
          </p>
        ) : (
          <>
            <Dropdown
              options={options}
              label='facilitator'
              placeholder='Select a member'
              width='w-full'
              size='md'
              defaultEmpty
              onSelect={option => setSelectedId(option.value)}
            />
            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className='bg-primary/85 py-2 px-4 hover:bg-primary rounded-xl text-lg text-text-primary uppercase text-center font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Choose
            </button>
          </>
        )}

        <div className='flex items-center gap-3'>
          <div className='flex-1 h-px bg-border-light' />
          <span className='text-text-secondary text-xs uppercase tracking-widest'>
            or
          </span>
          <div className='flex-1 h-px bg-border-light' />
        </div>

        <button
          onClick={handleRoll}
          className='group flex items-center justify-center gap-2 border border-secondary py-2 px-4 hover:border-primary rounded-xl text-lg text-secondary uppercase text-center font-bold cursor-pointer'
        >
          <D20Icon
            height={20}
            width={20}
            className='transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]'
          />
          Roll for Facilitator
        </button>
      </div>
    </Modal>
  )
}

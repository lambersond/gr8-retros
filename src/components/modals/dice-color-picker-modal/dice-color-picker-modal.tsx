'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/common'
import { D20Icon } from '@/components/common/icons'
import { DICE_COLORS } from '@/constants'
import { useModals } from '@/hooks/use-modals'
import type { DiceColorPickerModalProps } from './types'

export function DiceColorPickerModal({
  open = true,
  submitRoll,
  onDnr,
}: Readonly<DiceColorPickerModalProps>) {
  const { closeModal } = useModals()
  const [selectedColor, setSelectedColor] = useState<string>()

  useEffect(() => {
    if (open) setSelectedColor(undefined)
  }, [open])

  const onClose = () => {
    closeModal('DiceColorPickerModal')
    if (!selectedColor) onDnr?.()
  }

  const handleRoll = () => {
    if (!selectedColor) return
    closeModal('DiceColorPickerModal')
    submitRoll(selectedColor)
  }

  return (
    <Modal
      title='Choose Your Dice'
      isOpen={open}
      onClose={onClose}
      width='w-[fit-content_!important]'
    >
      <div className='flex flex-col gap-6 p-4'>
        <div className='flex flex-wrap justify-center gap-4'>
          {DICE_COLORS.map(color => (
            <button
              key={color.hex}
              onClick={() => setSelectedColor(color.hex)}
              className={`group cursor-pointer transition-all ${
                selectedColor === color.hex
                  ? 'scale-110 drop-shadow-lg'
                  : 'hover:scale-105'
              }`}
              title={color.name}
            >
              <D20Icon
                height={48}
                width={48}
                className='transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]'
                style={{ color: color.hex }}
              />
            </button>
          ))}
        </div>
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='border border-secondary py-2 px-4 hover:border-primary rounded-xl text-lg text-secondary uppercase text-center font-bold cursor-pointer'
          >
            Cancel
          </button>
          <button
            onClick={handleRoll}
            disabled={!selectedColor}
            className='bg-primary/85 py-2 px-4 hover:bg-primary rounded-xl text-lg text-text-primary uppercase text-center font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
          >
            Roll
          </button>
        </div>
      </div>
    </Modal>
  )
}

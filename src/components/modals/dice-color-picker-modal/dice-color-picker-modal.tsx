'use client'

import { useState } from 'react'
import { Modal } from '@/components/common'
import { DICE_COLORS } from '@/constants'
import { useModals } from '@/hooks/use-modals'
import type { DiceColorPickerModalProps } from './types'

export function DiceColorPickerModal({
  open = true,
  submitRoll,
}: Readonly<DiceColorPickerModalProps>) {
  const { closeModal } = useModals()
  const [selectedColor, setSelectedColor] = useState<string>()

  const onClose = () => closeModal('DiceColorPickerModal')

  const handleRoll = () => {
    if (!selectedColor) return
    onClose()
    submitRoll(selectedColor)
  }

  return (
    <Modal title='Choose Your Dice' isOpen={open} onClose={onClose}>
      <div className='flex flex-col gap-6 py-4'>
        <div className='flex flex-wrap justify-center gap-4'>
          {DICE_COLORS.map(color => (
            <button
              key={color.hex}
              onClick={() => setSelectedColor(color.hex)}
              className={`w-12 h-12 rounded-full cursor-pointer transition-all ${
                selectedColor === color.hex
                  ? 'ring-3 ring-offset-2 ring-primary scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
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

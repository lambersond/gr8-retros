'use client'

import { useState, useCallback } from 'react'
import { Check, X } from 'lucide-react'
import { CircularLoader } from '@/components/common'

type SaveButtonProps = {
  onSave?: () => Promise<void> | void
  disabled?: boolean
}

export function SaveButton({
  onSave,
  disabled = false,
}: Readonly<SaveButtonProps>) {
  const [saveState, setSaveState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const handleSave = useCallback(async () => {
    if (saveState !== 'idle') return
    setSaveState('loading')
    try {
      await onSave?.()
      setSaveState('success')
    } catch {
      setSaveState('error')
    } finally {
      setTimeout(() => setSaveState('idle'), 1500)
    }
  }, [saveState, onSave])

  return (
    <button
      type='button'
      onClick={handleSave}
      disabled={saveState !== 'idle' || disabled}
      className='flex min-w-36 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors enabled:hover:bg-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-20'
    >
      {saveState === 'loading' && (
        <CircularLoader size='sm' color='text-white' label='' />
      )}
      {saveState === 'success' && <Check size={16} />}
      {saveState === 'error' && <X size={16} />}
      {saveState === 'idle' && 'Save changes'}
      {saveState === 'success' && 'Saved!'}
      {saveState === 'error' && 'Failed'}
    </button>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import {
  useBoardPermissions,
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function BoardNameSettings() {
  const { boardName } = useBoardSettings()
  const { updateBoardName } = useBoardSettingsActions()
  const {
    user: { hasAdmin },
  } = useBoardPermissions()

  const [value, setValue] = useState(boardName)
  const [saved, setSaved] = useState(false)

  // Keep local input in sync when the persisted name changes (e.g. another
  // admin renamed the board while we had the sidebar open).
  useEffect(() => {
    setValue(boardName)
  }, [boardName])

  if (!hasAdmin) return

  const trimmed = value.trim()
  const isDirty = trimmed.length > 0 && trimmed !== boardName

  const handleSave = async () => {
    if (!isDirty) return
    await updateBoardName(trimmed)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <section className='flex flex-col gap-2 rounded-lg border border-border-light bg-paper px-4 py-3'>
      <label
        htmlFor='board-name-input'
        className='text-sm font-semibold text-text-primary'
      >
        Board Title
      </label>
      <div className='flex items-center gap-2'>
        <input
          id='board-name-input'
          type='text'
          value={value}
          maxLength={120}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSave()
            }
          }}
          className='flex-1 min-w-0 rounded-md border border-border-light bg-card px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-primary'
        />
        <button
          type='button'
          onClick={handleSave}
          disabled={!isDirty}
          className='px-3 py-1 text-sm font-semibold rounded-md bg-primary/85 text-text-primary hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1'
        >
          {saved ? (
            <>
              <Check className='size-4' />
              Saved
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </section>
  )
}

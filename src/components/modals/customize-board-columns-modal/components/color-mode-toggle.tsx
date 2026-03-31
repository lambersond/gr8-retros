import { useState } from 'react'
import { ColorMode } from '../types'

export function ColorModeToggle({
  compact,
  onChange,
}: Readonly<{ compact?: boolean; onChange?: (mode: ColorMode) => void }>) {
  const [mode, setMode] = useState<ColorMode>('light')

  return (
    <div className='flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800'>
      {(['light', 'dark'] as ColorMode[]).map(m => (
        <button
          key={m}
          type='button'
          onClick={() => {
            setMode(m)
            onChange?.(m)
          }}
          className={[
            'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-all',
            mode === m
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
          ].join(' ')}
        >
          {m === 'light' ? '☀️' : '🌙'} {compact ? '' : m}
        </button>
      ))}
    </div>
  )
}

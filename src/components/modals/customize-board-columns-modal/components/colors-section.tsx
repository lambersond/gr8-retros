import { useState } from 'react'
import { ColorField } from './color-field'
import type { ColorMode } from '../types'
import type { ColorsSectionProps } from './types'

export function ColorsSection({
  column,
  onChange,
}: Readonly<ColorsSectionProps>) {
  const [mode, setMode] = useState<ColorMode>('light')

  const fields =
    mode === 'light'
      ? ([
          { key: 'lightBg', label: 'Background' },
          { key: 'lightBorder', label: 'Border' },
          { key: 'lightTitleBg', label: 'Header background' },
          { key: 'lightTitleText', label: 'Header text' },
        ] as const)
      : ([
          { key: 'darkBg', label: 'Background' },
          { key: 'darkBorder', label: 'Border' },
          { key: 'darkTitleBg', label: 'Header background' },
          { key: 'darkTitleText', label: 'Header text' },
        ] as const)

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <p className='text-sm font-semibold text-text-primary'>Colors</p>
        {/* TODO enable dark/light mode toggle once dark mode is supported */}
        <div className='hidden flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800'>
          {(['light', 'dark'] as ColorMode[]).map(m => (
            <button
              key={m}
              type='button'
              onClick={() => setMode(m)}
              className={[
                'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-all',
                mode === m
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
              ].join(' ')}
            >
              {m === 'light' ? '☀️' : '🌙'} {m}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {fields.map(({ key, label }) => (
          <ColorField
            key={`${column.id}-${key}`}
            label={label}
            value={column[key]}
            onChange={v => onChange(key, v)}
          />
        ))}
      </div>
    </div>
  )
}

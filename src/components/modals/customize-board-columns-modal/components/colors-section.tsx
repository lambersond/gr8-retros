import { useState } from 'react'
import { ColorField } from './color-field'
import { ColorModeToggle } from './color-mode-toggle'
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
        <ColorModeToggle compact onChange={setMode} />
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

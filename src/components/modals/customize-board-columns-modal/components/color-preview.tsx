import clsx from 'clsx'
import type { ColorPreviewProps } from './types'

export function ColumnPreview({
  column,
  mode,
  isSelected = false,
  onClick,
}: Readonly<ColorPreviewProps>) {
  const bg = mode === 'light' ? column.lightBg : column.darkBg
  const border = mode === 'light' ? column.lightBorder : column.darkBorder
  const titleBg = mode === 'light' ? column.lightTitleBg : column.darkTitleBg
  const titleText =
    mode === 'light' ? column.lightTitleText : column.darkTitleText

  return (
    <button
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      className={clsx(
        'overflow-hidden rounded-xl border-2 transition-all cursor-pointer w-full',
        {
          'ring-2 ring-primary ring-offset-1': isSelected,
        },
      )}
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <div
        className='font-semibold truncate px-3 py-2 text-sm'
        style={{ backgroundColor: titleBg, color: titleText }}
      >
        {column.emoji} {column.label}
      </div>
      <div className='space-y-1.5 p-2'>
        {['Card one', 'Card two'].map(t => (
          <div
            key={t}
            className='rounded px-2 py-1.5 text-xs'
            style={{
              backgroundColor:
                mode === 'light'
                  ? 'rgba(0,0,0,0.05)'
                  : 'rgba(255,255,255,0.07)',
              color: mode === 'light' ? '#6b7280' : '#9ca3af',
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </button>
  )
}

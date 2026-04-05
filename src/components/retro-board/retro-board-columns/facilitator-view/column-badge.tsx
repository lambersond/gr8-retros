import type { ColumnInfo } from './types'

export function ColumnBadge({
  column,
  columnMap,
}: Readonly<{
  column: string
  columnMap: Record<string, ColumnInfo>
}>) {
  const config = columnMap[column]
  if (!config) return
  return (
    <span
      className='inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-2'
      style={{ backgroundColor: config.titleBg, color: config.titleText }}
    >
      {config.emoji && <span>{config.emoji}</span>}
      {config.label}
    </span>
  )
}

import { useEffect, useState } from 'react'
import { ColumnBadge } from './column-badge'
import { ItemContent } from './item-content'
import type { ColumnInfo, FacilitatorItem } from './types'

export function ExitingOverlay({
  item,
  currentUserId,
  columnMap,
}: Readonly<{
  item: FacilitatorItem
  currentUserId?: string
  columnMap: Record<string, ColumnInfo>
}>) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setStarted(true))
  }, [])

  return (
    <div
      className='absolute inset-x-0 top-0 z-10 pointer-events-none transition-all duration-500 ease-in-out'
      style={{
        opacity: started ? 0 : 1,
        transform: started
          ? 'translateY(-30px) scale(0.97)'
          : 'translateY(0) scale(1)',
      }}
    >
      <ColumnBadge column={item.data.column} columnMap={columnMap} />
      <ItemContent item={item} currentUserId={currentUserId} />
    </div>
  )
}

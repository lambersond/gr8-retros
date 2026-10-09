import { useEffect, useState } from 'react'
import { ItemContent } from './item-content'
import { ColumnBadge, type ColumnInfo } from '@/components/column-badge'
import type { FacilitatorItem } from './types'

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
    // z-1 lifts it over the incoming top card, but it lifts off under the
    // sticky action bar (z-2) like any other content scrolling past it.
    <div
      className='absolute inset-x-0 top-0 z-1 pointer-events-none transition-all duration-500 ease-in-out'
      style={{
        opacity: started ? 0 : 1,
        transform: started
          ? 'translateY(-30px) scale(0.97)'
          : 'translateY(0) scale(1)',
      }}
    >
      <ColumnBadge
        column={item.data.column}
        columnMap={columnMap}
        className='mb-2'
      />
      <ItemContent item={item} currentUserId={currentUserId} />
    </div>
  )
}

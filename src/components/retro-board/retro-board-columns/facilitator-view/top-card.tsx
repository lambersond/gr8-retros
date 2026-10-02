import { useEffect, useState } from 'react'
import { ItemContent } from './item-content'
import { ColumnBadge, type ColumnInfo } from '@/components/column-badge'
import type { FacilitatorItem } from './types'

export function TopCard({
  item,
  currentUserId,
  columnMap,
}: Readonly<{
  item: FacilitatorItem
  currentUserId?: string
  columnMap: Record<string, ColumnInfo>
}>) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  return (
    <div
      className='transition-all duration-300 ease-out'
      style={{
        opacity: Number(isVisible),
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
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

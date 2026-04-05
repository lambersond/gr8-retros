import { useEffect, useState } from 'react'
import { ColumnBadge } from './column-badge'
import { ItemContent } from './item-content'
import type { ColumnInfo, FacilitatorItem } from './types'

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
      <ColumnBadge column={item.data.column} columnMap={columnMap} />
      <ItemContent item={item} currentUserId={currentUserId} />
    </div>
  )
}

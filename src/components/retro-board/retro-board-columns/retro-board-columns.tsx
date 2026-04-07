'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Column } from './column'
import { COLUMN_CLASSES, COLUMN_CONTAINER_CLASSES } from './constants'
import { FacilitatorView } from './facilitator-view'
import { OrphanedColumn } from './orphaned-column'
import { useOrphanedItems } from '@/providers/retro-board/cards'
import { useBoardColumns } from '@/providers/retro-board/columns'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import { toColumnConfig } from '@/utils/column-utils'

export function RetroBoardColumns() {
  const { columns } = useBoardColumns()
  const orphanedItems = useOrphanedItems()
  const isFacilitatorMode = useBoardControlsState(
    s => s.boardControls.facilitatorMode.isActive,
  )

  // Mount the orphaned column when items appear; keep mounted during exit animation
  const [orphanedVisible, setOrphanedVisible] = useState(
    orphanedItems.length > 0,
  )
  const [orphanedExiting, setOrphanedExiting] = useState(false)
  const prevOrphanedCountRef = useRef(orphanedItems.length)

  useEffect(() => {
    if (orphanedItems.length > 0) {
      setOrphanedVisible(true)
    } else if (prevOrphanedCountRef.current > 0) {
      setOrphanedExiting(true)
    }
    prevOrphanedCountRef.current = orphanedItems.length
  }, [orphanedItems.length])

  const handleOrphanedTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.target === e.currentTarget && orphanedExiting) {
        setOrphanedVisible(false)
        setOrphanedExiting(false)
      }
    },
    [orphanedExiting],
  )

  if (isFacilitatorMode) {
    return <FacilitatorView />
  }

  return (
    <div className={COLUMN_CONTAINER_CLASSES}>
      {orphanedVisible && (
        <div
          className={clsx(
            COLUMN_CLASSES,
            'overflow-hidden transition-all duration-500 ease-in-out',
          )}
          style={
            orphanedExiting
              ? {
                  width: 0,
                  minWidth: 0,
                  flexBasis: 0,
                  flexGrow: 0,
                  padding: 0,
                  opacity: 0,
                }
              : undefined
          }
          onTransitionEnd={handleOrphanedTransitionEnd}
        >
          <OrphanedColumn items={orphanedItems} />
        </div>
      )}
      {columns.map(column => (
        <div key={column.id} className={COLUMN_CLASSES}>
          <Column
            type={column.columnType}
            columnConfig={toColumnConfig(column)}
          />
        </div>
      ))}
    </div>
  )
}

'use client'

import { Column } from './column'
import { COLUMN_CLASSES, COLUMN_CONTAINER_CLASSES } from './constants'
import { FacilitatorView } from './facilitator-view'
import { useBoardColumns } from '@/providers/retro-board/columns'
import { useBoardControlsState } from '@/providers/retro-board/controls'
import { toColumnConfig } from '@/utils/column-utils'

export function RetroBoardColumns() {
  const { columns } = useBoardColumns()
  const isFacilitatorMode = useBoardControlsState(
    s => s.boardControls.facilitatorMode.isActive,
  )

  if (isFacilitatorMode) {
    return <FacilitatorView />
  }

  return (
    <div className={COLUMN_CONTAINER_CLASSES}>
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

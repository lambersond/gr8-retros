'use client'

import { Column } from './column'
import { COLUMN_CLASSES, COLUMN_CONTAINER_CLASSES } from './constants'
import { useBoardColumns } from '@/providers/retro-board/columns'
import { toColumnConfig } from '@/utils/column-utils'

export function RetroBoardColumns() {
  const { columns } = useBoardColumns()

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

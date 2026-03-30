import type { Board, Column } from '@/types'

export function createInitialState(board: Board) {
  const columnsOrdered = orderColumns(board.settings.columns)
  return {
    columns: columnsOrdered,
  }
}

function orderColumns(columns: Column[]) {
  return columns.toSorted((a, b) => a.index - b.index)
}

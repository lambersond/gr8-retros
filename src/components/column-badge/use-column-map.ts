'use client'

import { useMemo } from 'react'
import { useTheme } from 'next-themes'
import { useBoardColumns } from '@/providers/retro-board/columns'
import type { ColumnInfo } from './types'

// The board's columns keyed by column type, with title colors for the active
// theme. Keys are added in the board's column order.
export function useColumnMap() {
  const { columns } = useBoardColumns()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return useMemo(() => {
    const map: Record<string, ColumnInfo> = {}
    for (const col of columns) {
      map[col.columnType] = {
        label: col.label,
        emoji: col.emoji ?? undefined,
        titleBg: isDark ? col.darkTitleBg : col.lightTitleBg,
        titleText: isDark ? col.darkTitleText : col.lightTitleText,
      }
    }
    return map
  }, [columns, isDark])
}

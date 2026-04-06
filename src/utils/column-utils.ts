import { RETRO_THEMES } from '@/constants'
import type { Column } from '@/types'

const standardTheme = RETRO_THEMES.find(t => t.id === 'standard')!

export function buildDefaultColumnData() {
  return standardTheme.columns.map((col, index) => ({
    index,
    ...col,
  }))
}

export function toColumnConfig(column: Column) {
  return {
    label: column.label,
    index: column.index,
    emoji: column.emoji ?? undefined,
    tagline: column.tagline ?? undefined,
    placeholder: column.placeholder ?? undefined,
    light: {
      bg: column.lightBg,
      border: column.lightBorder,
      titleBg: column.lightTitleBg,
      titleText: column.lightTitleText,
    },
    dark: {
      bg: column.darkBg,
      border: column.darkBorder,
      titleBg: column.darkTitleBg,
      titleText: column.darkTitleText,
    },
  }
}

export function toColumnConfigMap(columns: Column[]) {
  const map: Record<string, ReturnType<typeof toColumnConfig>> = {}
  for (const col of columns) {
    map[col.columnType] = toColumnConfig(col)
  }
  return map
}

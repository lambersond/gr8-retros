import { COLUMN_TYPES, PRESET_COLUMNS } from '@/constants'
import type { Column } from '@/types'

export function buildDefaultColumnData() {
  return COLUMN_TYPES.map((type, index) => {
    const style = PRESET_COLUMNS[type]
    return {
      index,
      columnType: type,
      label: style.label,
      emoji: style.emoji ?? undefined,
      tagline: style.tagline ?? undefined,
      placeholder: style.placeholder ?? undefined,
      lightBg: style.light.bg,
      lightBorder: style.light.border,
      lightTitleBg: style.light.titleBg,
      lightTitleText: style.light.titleText,
      darkBg: style.dark.bg,
      darkBorder: style.dark.border,
      darkTitleBg: style.dark.titleBg,
      darkTitleText: style.dark.titleText,
    }
  })
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

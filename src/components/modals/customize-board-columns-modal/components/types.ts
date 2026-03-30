import type { ColorMode } from '../types'
import type { Column } from '@/types'

export type ColorPreviewProps = {
  column: Column
  mode: ColorMode
  isSelected?: boolean
  onClick?: VoidFunction
}

export type ColorFieldProps = {
  label: string
  value: string
  onChange: (v: string) => void
}

export type ColumnListItemProps = {
  column: Column
  isSelected: boolean
  isDragging: boolean
  isDragOver: boolean
  onSelect: VoidFunction
  onDelete: VoidFunction
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onDragEnd: () => void
}

export type ColorsSectionProps = {
  column: Column
  onChange: (key: keyof Column, value: string) => void
}

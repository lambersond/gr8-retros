import clsx from 'classnames'
import { GripVertical, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/common'
import type { ColumnListItemProps } from './types'

export function ColumnListItem({
  column,
  isSelected,
  isDragging,
  isDragOver,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: Readonly<ColumnListItemProps>) {
  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={clsx(
        'group flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors',
        {
          'opacity-40': isDragging,
          'ring-2 ring-primary ring-inset': isDragOver,
          'bg-primary/20 text-primary': isSelected,
          'text-text-primary hover:bg-primary/10': !isSelected,
        },
      )}
    >
      <GripVertical size={12} className='cursor-grab' />
      <button
        onClick={onSelect}
        className='flex min-w-0 flex-1 items-center gap-2 text-left'
      >
        <span className='text-base leading-none'>{column.emoji}</span>
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium'>{column.label}</p>
          <p
            className={clsx('text-[10px] font-medium uppercase tracking-wide', {
              'text-primary dark:text-primary': isSelected,
              'text-text-secondary': !isSelected,
            })}
          >
            {column.columnType}
          </p>
        </div>
      </button>

      <IconButton
        onClick={onDelete}
        icon={Trash2}
        size='sm'
        className={clsx(
          'flex-shrink-0 rounded p-0.5 text-xs transition-opacity hover:text-danger',
          {
            'opacity-100': isSelected,
            'opacity-0 group-hover:opacity-100': !isSelected,
          },
        )}
      />
    </li>
  )
}

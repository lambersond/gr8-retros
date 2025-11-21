import clsx from 'classnames'
import { Square, SquareCheckBig } from 'lucide-react'
import type { IconButtonProps } from '../common/button/types'

export function getActionItemClassNames(isDone: boolean) {
  return clsx(
    {
      'line-through text-text-tertiary group-hover:no-underline': isDone,
    },
    'text-left',
  )
}

export function getIconButtonProps(isDone: boolean) {
  return {
    icon: isDone ? SquareCheckBig : Square,
    tooltip: isDone ? 'Mark Undone' : 'Mark Done',
    intent: isDone ? 'success' : 'primary',
    size: 'md',
  } as Pick<IconButtonProps, 'icon' | 'tooltip' | 'intent' | 'size'>
}

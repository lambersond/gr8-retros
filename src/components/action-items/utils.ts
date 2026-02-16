import clsx from 'classnames'
import { Square, SquareCheckBig } from 'lucide-react'
import type { IconButtonProps } from '../common/button/types'

export function getActionItemClassNames(isDone: boolean, indent: number) {
  return clsx(
    {
      'line-through text-text-tertiary group-hover:no-underline': isDone,
      '-ml-13.5 indent-13.5': indent === 2,
      '-ml-6.5 indent-6': indent === 1,
    },
    'text-left mt-0.5',
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

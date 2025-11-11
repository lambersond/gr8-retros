'use client'

import clsx from 'classnames'
import { Tooltip } from '../tooltip'
import type { IconButtonProps } from './types'

export function IconButton({
  icon: Icon,
  onClick,
  tooltip,
  size = 'sm',
  intent = 'normal',
}: Readonly<IconButtonProps>) {
  const sizeClasses = clsx({
    'size-4': size === 'sm',
    'size-5': size === 'md',
    'size-6': size === 'lg',
    'size-7': size === 'xl',
  })

  const intentClasses = clsx({
    'text-primary hover:bg-primary/10': intent === 'primary',
    'text-text-tertiary hover:bg-text-tertiary/10': intent === 'normal',
    'text-success hover:bg-success/10': intent === 'success',
    'text-warning hover:bg-warning/10': intent === 'warning',
    'text-danger hover:bg-danger/10': intent === 'danger',
  })

  const buttonClasses = clsx(
    'flex items-center text-sm p-1 rounded cursor-pointer',
    intentClasses,
  )

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement='bottom' asChild>
        <button className={buttonClasses} onClick={onClick}>
          <Icon className={sizeClasses} />
        </button>
      </Tooltip>
    )
  }

  return (
    <button className={buttonClasses} onClick={onClick}>
      <Icon className={sizeClasses} />
    </button>
  )
}

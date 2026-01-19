'use client'

import { useRef, useState } from 'react'
import clsx from 'classnames'
import { Tooltip } from '../tooltip'
import type { IconButtonProps } from './types'

export function IconButton({
  icon: Icon,
  actionIcon: ActionIcon,
  onClick,
  tooltip,
  size = 'md',
  intent = 'normal',
}: Readonly<IconButtonProps>) {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const [loadingState, setLoadingState] = useState<
    'idle' | 'loading' | 'loaded'
  >('idle')

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
    'text-info hover:bg-info/10': intent === 'info',
  })

  const buttonClasses = clsx(
    'flex items-center text-sm p-1 rounded cursor-pointer h-fit z-1',
    intentClasses,
  )
  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setLoadingState('loading')
    if (onClick) {
      await Promise.resolve(onClick(e))
    }
    setLoadingState('loaded')

    clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      setLoadingState('idle')
    }, 1500)
  }

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement='bottom' asChild>
        <button
          className={buttonClasses}
          onClick={ActionIcon ? handleClick : onClick}
        >
          {loadingState === 'loaded' && ActionIcon ? (
            <ActionIcon className={sizeClasses} />
          ) : (
            <Icon className={sizeClasses} />
          )}
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

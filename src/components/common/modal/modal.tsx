'use client'

import { useRef, useEffect, useState } from 'react'
import clsx from 'classnames'
import { X } from 'lucide-react'
import { IconButton } from '../button'
import type { ModalProps } from './types'

export function Modal({
  children,
  headerClassName = '',
  isOpen,
  onClose,
  title,
  subtitle,
  width = '',
  fullHeight = false,
  fullScreen = false,
  disableContainerStyles = false,
  containerClassName = '',
}: Readonly<ModalProps>) {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(52)

  useEffect(() => {
    if (!headerRef.current) return

    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }

    updateHeaderHeight()

    const resizeObserver = new ResizeObserver(updateHeaderHeight)
    resizeObserver.observe(headerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [isOpen, headerClassName])

  if (!isOpen) return

  const headerClassNames = clsx(
    'flex justify-between items-center p-3',
    headerClassName,
  )

  return (
    <div className='fixed inset-0 flex items-center justify-center z-1200'>
      <summary
        className='absolute inset-0 bg-primary opacity-75'
        data-testid='modal__backdrop'
        onClick={onClose}
      />
      <div
        data-testid='modal'
        className={clsx(
          'relative bg-paper z-1500 overflow-hidden shadow-lg h-full sm:rounded-none',
          {
            'sm:rounded-xl max-w-2xl min-w-full sm:min-w-sm sm:w-auto':
              !fullScreen,
            'min-w-full w-full min-h-full': fullScreen,
            'w-sm md:w-md': !fullScreen,
            'sm:h-fit': !fullHeight,
          },
          width,
        )}
      >
        <div className={headerClassNames} ref={headerRef}>
          <div>
            <p className='text-2xl font-bold text-text-primary'>{title}</p>
            {subtitle}
          </div>
          <IconButton icon={X} onClick={onClose} size='lg' />
        </div>
        <div
          style={{
            maxHeight: `calc(100vh - ${headerHeight}px)`,
            height: fullScreen ? `calc(100vh - ${headerHeight}px)` : 'auto',
          }}
          className={clsx(
            {
              'overflow-y-auto p-3 h-full md:h-unset': !disableContainerStyles,
            },
            containerClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

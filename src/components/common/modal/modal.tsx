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
  width = 'w-sm md:w-md',
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
        className={`relative bg-paper max-w-2xl ${width} z-1000 overflow-hidden shadow-lg h-full min-w-full sm:min-w-sm  sm:rounded-xl sm:h-fit`}
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
          }}
          className='overflow-y-auto p-3 h-full md:h-unset'
        >
          {children}
        </div>
      </div>
    </div>
  )
}

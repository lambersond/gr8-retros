'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SidebarTrigger } from './sidebar-trigger'
import type { SidebarProps } from './types'

const SidebarContext = createContext<{
  onClose?: VoidFunction
  side?: 'left' | 'right'
  isOpen?: boolean
}>({ isOpen: false })

export const useSidebar = () => useContext(SidebarContext)

export function Sidebar({
  children,
  trigger,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  className = 'w-sm',
  side = 'left',
}: Readonly<SidebarProps>) {
  const isControlled = controlledIsOpen !== undefined
  const [open, setOpen] = useState(false)

  const closeSidebar = () => {
    if (isControlled) controlledOnClose()
    else setOpen(false)
  }

  const providerValue = useMemo(
    () => ({ onClose: closeSidebar, side, isOpen: open }),
    [side, open],
  )

  useEffect(() => {
    if (controlledIsOpen !== undefined) setOpen(controlledIsOpen)
  }, [controlledIsOpen])

  const sideClasses = {
    left: {
      position: 'left-0',
      transform: open ? 'translate-x-0' : '-translate-x-full',
    },
    right: {
      position: 'right-0',
      transform: open ? 'translate-x-0' : 'translate-x-full',
    },
  } as const

  const currentSide = sideClasses[side]

  return (
    <>
      {!!trigger && <SidebarTrigger setOpen={setOpen} trigger={trigger} />}

      {open && (
        <button
          type='button'
          data-testid='sidebar__overlay'
          aria-label='Close sidebar'
          className='fixed inset-0 z-10'
          onClick={closeSidebar}
          onKeyDown={e => {
            if (e.key === 'Escape') closeSidebar()
          }}
        />
      )}

      <div
        data-testid='sidebar'
        className={`scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-transparent fixed top-16 z-50 h-full max-h-[calc(100vh_-_64px)] overflow-y-auto bg-appbar shadow-lg transform transition-transform ${currentSide.position} ${currentSide.transform} ${className}`}
      >
        <SidebarContext.Provider value={providerValue}>
          {open && children}
        </SidebarContext.Provider>
      </div>
    </>
  )
}

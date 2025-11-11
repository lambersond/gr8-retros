'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SidebarTrigger } from './sidebar-trigger'
import type { SidebarProps } from './types'

export function Sidebar({
  children,
  trigger,
  className = 'w-sm',
  side = 'left',
}: Readonly<SidebarProps>) {
  const [open, setOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const closeSidebar = () => {
    setOpen(false)
  }

  const providerValue = useMemo(() => {
    return { onClose: closeSidebar, side, isOpen: open }
  }, [side, open])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar()
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const sideClasses = {
    left: {
      position: 'left-0',
      transform: open ? 'translate-x-0' : '-translate-x-full',
    },
    right: {
      position: 'right-0',
      transform: open ? 'translate-x-0' : 'translate-x-full',
    },
  }

  const currentSide = sideClasses[side]

  return (
    <>
      <SidebarTrigger setOpen={setOpen} trigger={trigger} />
      <div
        ref={sidebarRef}
        data-testid='sidebar'
        className={`overflow-y-auto max-h-[calc(100vh_-_64px)] fixed top-16 h-full bg-appbar shadow-lg transform transition-transform z-50 ${currentSide.position} ${currentSide.transform} ${className}`}
      >
        <SidebarContext.Provider value={providerValue}>
          {children}
        </SidebarContext.Provider>
      </div>
      {open && (
        <input
          type='image'
          style={{ scale: 1.25 }}
          data-testid='sidebar__overlay'
          className='fixed inset-0 bg-black/01 z-40'
          tabIndex={0}
          aria-label='Close sidebar'
          onClick={closeSidebar}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              closeSidebar()
            }
          }}
        />
      )}
    </>
  )
}

const SidebarContext = createContext<{
  onClose?: VoidFunction
  side?: 'left' | 'right'
  isOpen?: boolean
}>({ isOpen: false })

export const useSidebar = () => useContext(SidebarContext)

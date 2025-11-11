import type { Dispatch, ReactNode, SetStateAction } from 'react'

export type SidebarProps = {
  children: ReactNode
  trigger: ReactNode
  className?: string
  side?: 'left' | 'right'
}

export type SidebarTriggerProps = {
  trigger: ReactNode
  setOpen: Dispatch<SetStateAction<boolean>>
}

export type SidebarItemProps = {
  children: ReactNode
}

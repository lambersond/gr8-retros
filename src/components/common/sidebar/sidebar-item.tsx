'use client'

import { useSidebar } from './sidebar'
import type { SidebarItemProps } from './types'

export function SidebarItem({ children }: Readonly<SidebarItemProps>) {
  const { onClose } = useSidebar()
  return <div onClick={onClose}>{children}</div>
}

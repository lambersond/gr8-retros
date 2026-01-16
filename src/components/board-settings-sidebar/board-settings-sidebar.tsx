import { SidebarCloseIcon } from 'lucide-react'
import { Sidebar, SidebarItem } from '../common'
import {
  BoardMembers,
  ClaimBoard,
  DangerZoneSettings,
  PrivateSettings,
} from './settings-sections'
import {
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function BoardSettingsSidebar() {
  const { closeSidebar } = useBoardSettingsActions()
  const { boardId, sidebarOpen, boardTier } = useBoardSettings()

  return (
    <Sidebar
      side='right'
      isOpen={sidebarOpen}
      onClose={closeSidebar}
      className='w-full sm:w-sm shadow-xl'
    >
      <div className='flex flex-col p-2 pt-0 h-full'>
        <section className='flex items-start justify-between sticky top-0 bg-appbar z-10 pb-4'>
          <div>
            <p className='text-2xl font-bold'>Board Settings</p>
            <p className='text-text-secondary text-sm'>
              ({boardTier || 'FREE'}) {boardId}
            </p>
          </div>
          <SidebarItem>
            <SidebarCloseIcon className='size-10 p-2 transform rotate-180 text-text-secondary hover:text-text-primary hover:bg-hover rounded-full cursor-pointer' />
          </SidebarItem>
        </section>
        <ClaimBoard />
        <section className='flex flex-col gap-4 overflow-y-auto'>
          <BoardMembers />
          <PrivateSettings />
          <DangerZoneSettings />
        </section>
      </div>
    </Sidebar>
  )
}

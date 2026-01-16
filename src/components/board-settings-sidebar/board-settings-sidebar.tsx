import { SidebarCloseIcon } from 'lucide-react'
import { Badge, Sidebar, SidebarItem } from '../common'
import {
  BoardMembers,
  ClaimBoard,
  DangerZoneSettings,
  MusicSettings,
  PrivateSettings,
  TimerSettings,
  UpvoteSettings,
} from './settings-sections'
import { PaymentTier } from '@/enums'
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
            <div className='flex gap-1'>
              <Badge text={boardTier || PaymentTier.FREE} />
              <p className='text-text-secondary text-sm'>{boardId}</p>
            </div>
          </div>
          <SidebarItem>
            <SidebarCloseIcon className='size-10 p-2 transform rotate-180 text-text-secondary hover:text-text-primary hover:bg-hover rounded-full cursor-pointer' />
          </SidebarItem>
        </section>
        <ClaimBoard />
        <section className='flex flex-col gap-4 overflow-y-auto'>
          <BoardMembers />
          <PrivateSettings />
          <TimerSettings />
          <MusicSettings />
          <UpvoteSettings />
          <DangerZoneSettings />
        </section>
      </div>
    </Sidebar>
  )
}

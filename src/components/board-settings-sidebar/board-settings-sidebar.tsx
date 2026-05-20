import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDown, SidebarCloseIcon } from 'lucide-react'
import { PaymentTierBadge } from '../badges'
import { Sidebar, SidebarItem } from '../common'
import {
  ActionItemsSettings,
  AiSummarySettings,
  BoardCustomizationSettings,
  BoardMembers,
  BoardNameSettings,
  CardAuthoringSettings,
  ClaimBoard,
  CommentsSettings,
  DangerZoneSettings,
  DragAndDropSettings,
  FacilitatorModeSettings,
  MusicSettings,
  PrivateSettings,
  TimerSettings,
  UpvoteSettings,
  VotingSettings,
} from './settings-sections'
import {
  useBoardSettings,
  useBoardSettingsActions,
} from '@/providers/retro-board/board-settings'

export function BoardSettingsSidebar() {
  const { closeSidebar } = useBoardSettingsActions()
  const { sidebarOpen, boardTier } = useBoardSettings()

  return (
    <Sidebar
      side='right'
      isOpen={sidebarOpen}
      onClose={closeSidebar}
      className='w-full sm:w-sm shadow-xl overflow-x-hidden'
    >
      <div className='flex flex-col p-2 pt-0'>
        <section className='flex items-start justify-between sticky top-0 bg-appbar z-10 pb-4'>
          <div>
            <p className='text-2xl font-bold'>Board Settings</p>
            <div className='flex gap-1'>
              <PaymentTierBadge tier={boardTier} redirectToPlans />
            </div>
          </div>
          <SidebarItem>
            <SidebarCloseIcon className='size-10 p-2 transform rotate-180 text-text-secondary hover:text-text-primary hover:bg-hover rounded-full cursor-pointer' />
          </SidebarItem>
        </section>
        <ClaimBoard />
        <section className='flex flex-col gap-4 pb-4'>
          <BoardMembers />
          <PrivateSettings />
          <VotingSettings />
          <FacilitatorModeSettings />
          <DragAndDropSettings />
          <AiSummarySettings />
          <AdvancedSettings />
          <DangerZoneSettings />
        </section>
      </div>
    </Sidebar>
  )
}

function AdvancedSettings() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className='flex flex-col'>
      <button
        type='button'
        onClick={() => setExpanded(prev => !prev)}
        className='w-full flex items-center justify-between px-1 py-2 text-sm font-semibold text-text-primary hover:bg-hover rounded-md cursor-pointer'
        aria-expanded={expanded}
      >
        <span className='text-2xl'>Advanced Settings</span>
        <ChevronDown
          size={16}
          className={clsx('transition-transform', expanded && 'rotate-180')}
        />
      </button>
      <div
        className={clsx(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
          expanded
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0',
        )}
        aria-hidden={!expanded}
      >
        <div className='overflow-hidden'>
          <div className='flex flex-col gap-4 pt-2'>
            <BoardNameSettings />
            <BoardCustomizationSettings />
            <CardAuthoringSettings />
            <TimerSettings />
            <MusicSettings />
            <UpvoteSettings />
            <CommentsSettings />
            <ActionItemsSettings />
          </div>
        </div>
      </div>
    </div>
  )
}

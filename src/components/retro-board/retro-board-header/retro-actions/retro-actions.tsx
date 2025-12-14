'use client'

import { noop } from 'lodash'
import {
  ArrowDownWideNarrow,
  BrushCleaning,
  Eraser,
  Hammer,
} from 'lucide-react'
import Image from 'next/image'
import { useRetroActions } from './use-retro-actions'
import { IconButton, Menu, Popover, Tooltip } from '@/components/common'

export function RetroActions({ id }: Readonly<{ id: string }>) {
  const { handleClearBoard, handleClearCompleted, viewingMembers } =
    useRetroActions(id)

  return (
    <div className='mx-3 ml-auto relative flex gap-2'>
      <Popover
        modal
        placement='bottom-start'
        content={
          <Menu
            options={[
              {
                label: 'Clear Only Completed Items',
                onClick: handleClearCompleted,
                icon: <BrushCleaning size={16} />,
              },
              {
                label: 'Clear All Cards',
                onClick: handleClearBoard,
                color: 'danger',
                icon: <Eraser size={16} />,
              },
            ]}
          />
        }
      >
        <IconButton icon={Hammer} intent='primary' size='lg' />
      </Popover>
      <div className='hidden'>
        <Popover
          modal
          placement='bottom-start'
          content={
            <Menu
              options={[
                {
                  label: 'Sort by Discussed Status',
                  onClick: noop,
                },
                {
                  label: 'Sort by Most Votes',
                  onClick: noop,
                },
                {
                  label: 'Sort by Most Comments',
                  onClick: noop,
                },
                {
                  label: 'Sort by Most Action Items',
                  onClick: noop,
                },
              ]}
            />
          }
        >
          <IconButton icon={ArrowDownWideNarrow} intent='primary' size='lg' />
        </Popover>
      </div>
      <div className='ml-auto flex items-center'>
        {Object.entries(viewingMembers).map(([clientId, member]) => (
          <div
            key={clientId}
            className='relative flex items-center -ml-3 first:ml-0 transition-all duration-200 hover:z-10 hover:scale-110'
          >
            <Tooltip title={member.name}>
              <Image
                src={member.image}
                alt={member.name}
                width={32}
                height={32}
                className='w-8 h-8 rounded-full border-2 border-white shadow-sm'
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  )
}

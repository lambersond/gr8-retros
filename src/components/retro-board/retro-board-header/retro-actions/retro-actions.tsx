'use client'

import { useEffect, useRef, useState } from 'react'
import { useChannel, usePresence, usePresenceListener } from 'ably/react'
import { BrushCleaning, Eraser } from 'lucide-react'
import Image from 'next/image'
import { ACTION_TYPES } from '../../constants'
import { IconButton, Tooltip } from '@/components/common'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'

export function RetroActions({ id }: Readonly<{ id: string }>) {
  const { user } = useAuth()
  const userData = useRef(user)
  const { publish } = useChannel({ channelName: id })
  const [viewingMembers, setViewingMembers] = useState<{ [key: string]: any }>(
    {},
  )
  const { openModal } = useModals()

  const { updateStatus } = usePresence(id, {
    name: user.name,
    image: user.image,
  })

  const { presenceData } = usePresenceListener(id, (data: any) => {
    if (data.action === 'enter' || data.action === 'update') {
      setViewingMembers(prev => ({
        ...prev,
        [data.clientId]: data.data,
      }))
    } else if (data.action === 'leave') {
      setViewingMembers(prev => {
        const updated = { ...prev }
        delete updated[data.clientId]
        return updated
      })
    }
  })

  useEffect(() => {
    if (
      userData.current.name !== user.name ||
      userData.current.image !== user.image
    ) {
      userData.current = user
      updateStatus({
        name: user.name,
        image: user.image,
      })
    }
  }, [user.name, user.image, updateStatus])

  useEffect(() => {
    const initialMembers: { [key: string]: any } = {}
    for (const member of presenceData) {
      initialMembers[member.clientId] = member.data
    }
    setViewingMembers(initialMembers)
  }, [presenceData])

  const handleClearBoard = () => {
    openModal('ConfirmModal', {
      title: 'Erase Board Items',
      color: 'danger',
      message: 'Are you sure you want to remove all cards from this board?',
      onConfirm: () => {
        fetch(`/api/board/${id}/cards`, {
          method: 'DELETE',
          credentials: 'include',
        }).then(resp => {
          if (resp.ok) {
            publish({
              data: {
                type: ACTION_TYPES.DELETE_ALL_CARDS,
              },
            })
          }
        })
      },
      submitText: 'Yes, clear board',
    })
  }

  const handleClearCompleted = () => {
    openModal('ConfirmModal', {
      title: 'Clear Completed Items',
      color: 'danger',
      message:
        'This will remove all cards marked discussed and cards with completed action items. Are you sure?',
      onConfirm: () => {
        fetch(`/api/board/${id}/cards/completed`, {
          method: 'DELETE',
          credentials: 'include',
        }).then(resp => {
          if (resp.ok) {
            publish({
              data: {
                type: ACTION_TYPES.DELETE_COMPLETED_CARDS,
              },
            })
          }
        })
      },
      submitText: 'Yes, clear completed',
    })
  }

  return (
    <div className='mx-3 ml-auto relative flex gap-2'>
      <IconButton
        icon={Eraser}
        tooltip='Erase All Items'
        onClick={handleClearBoard}
        size='xl'
        intent='danger'
      />
      <IconButton
        icon={BrushCleaning}
        tooltip='Clear Discussed/Completed Items'
        onClick={handleClearCompleted}
        size='xl'
      />
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

'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { usePresence, usePresenceListener } from 'ably/react'
import { Eraser } from 'lucide-react'
import Image from 'next/image'
import { IconButton, Tooltip } from '@/components/common'
import { useAuth } from '@/hooks/use-auth'
import { useModals } from '@/hooks/use-modals'

const removeAllCards = async (id: any) => {
  await fetch(`/api/board/${id}/cards`, {
    method: 'DELETE',
    credentials: 'include',
  })

  globalThis.location.reload()
}

export function RetroActions({ id }: Readonly<{ id: string }>) {
  const { user } = useAuth()
  const userData = useRef(user)
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
      title: 'Clear Board',
      color: 'danger',
      message: 'Are you sure you want to remove all cards from this board?',
      onConfirm: () => {
        removeAllCards(id)
      },
      submitText: 'Yes, clear board',
    })
  }

  return (
    <div className='mx-3 ml-auto relative flex gap-2'>
      <IconButton
        icon={Eraser}
        tooltip='Clear All Board Items'
        onClick={handleClearBoard}
        size='xl'
        intent='danger'
      />
      {/* <IconButton
        icon={BrushCleaning}
        tooltip='Clear Discussed items with completed Action Items'
        onClick={() => console.warn('Not implemented yet')}
        size='xl'
      /> */}
      <div className='ml-auto flex items-center'>
        {Object.entries(viewingMembers)
          .filter(([, member]) => member.name !== userData.current.name)
          .map(([clientId, member]) => (
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

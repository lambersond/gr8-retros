'use client'

import { Shredder } from 'lucide-react'
import { useParams } from 'next/navigation'
import { IconButton } from '../common'
import { Auth } from './auth'
import { useModals } from '@/hooks/use-modals'

const removeAllCards = async (id: any) => {
  await fetch(`/api/board/${id}/cards`, {
    method: 'DELETE',
    credentials: 'include',
  })

  globalThis.location.reload()
}

export function AppBar() {
  const { id } = useParams()

  const { openModal } = useModals()

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
    <div className='flex items-center justify-between max-w-screen bg-appbar p-2 py-3 md:p-6 h-16'>
      <div className='flex items-baseline gap-2'>
        <span className='text-2xl font-extrabold tracking-tight text-slate-900'>
          Gr8 Retros
        </span>
        <span className='text-sm text-slate-600 hidden md:inline'>
          A simple and effective retrospective tool for teams
        </span>
      </div>
      {!!id && (
        <div className='mx-3 ml-auto'>
          <IconButton
            icon={Shredder}
            onClick={handleClearBoard}
            size='xl'
            intent='danger'
          />
        </div>
      )}
      <Auth />
    </div>
  )
}

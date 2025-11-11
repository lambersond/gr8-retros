'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CreateRetroButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = () => {
    if (isLoading) return
    setIsLoading(true)

    // Generate a short, shareable id
    const id = crypto.randomUUID().slice(0, 8)

    // Let /retro/[id]/page.tsx call getOrCreateBoardByIdAndUserId(id, userId)
    router.push(`/retro/${id}`)
  }

  return (
    <button
      onClick={handleCreate}
      disabled={isLoading}
      className='inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-6 py-3 text-base font-semibold shadow-md hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors'
    >
      <PlusCircle className='w-5 h-5' />
      {isLoading ? 'Creating your retro…' : 'Start a new Retro'}
    </button>
  )
}

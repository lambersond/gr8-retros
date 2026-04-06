'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const resp = await fetch('/api/stripe/portal', { method: 'POST' })
      if (!resp.ok) return
      const { url } = await resp.json()
      globalThis.location.href = url
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className='flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {isLoading ? 'Loading...' : 'Manage Subscription'}
      {!isLoading && <ExternalLink className='size-3.5' />}
    </button>
  )
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import { LinkIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import { useModals } from '@/hooks/use-modals'

type LinkedAccount = {
  provider: string
  providerAccountId: string
}

const PROVIDER_META: Record<string, { label: string; icon: string }> = {
  google: { label: 'Google', icon: '/google-icon-logo.svg' },
  discord: { label: 'Discord', icon: '/discord-icon-logo.svg' },
  github: { label: 'GitHub', icon: '/github-icon-logo.svg' },
}

export function LinkedAccounts() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { openModal } = useModals()

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch('/api/me/accounts')
      if (res.ok) {
        setAccounts(await res.json())
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleUnlink = (account: LinkedAccount) => {
    const meta = PROVIDER_META[account.provider]
    openModal('ConfirmModal', {
      title: 'Unlink Account',
      message: `Are you sure you want to unlink your ${meta?.label ?? account.provider} account?`,
      confirmButtonText: 'Unlink',
      color: 'danger',
      onConfirm: async () => {
        const res = await fetch('/api/me/accounts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          }),
        })
        if (res.ok) {
          setAccounts(prev =>
            prev.filter(a => a.providerAccountId !== account.providerAccountId),
          )
        }
      },
    })
  }

  const handleLinkAccount = () => {
    openModal('SignInModal', { redirectTo: '/me' } as any)
  }

  if (isLoading || accounts.length === 0) return

  return (
    <div className='flex items-center gap-2 mt-1.5'>
      {accounts.map(account => {
        const meta = PROVIDER_META[account.provider] ?? {
          label: account.provider,
          icon: '',
        }
        return (
          <div
            key={`${account.provider}-${account.providerAccountId}`}
            className='group relative w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-border-light cursor-default'
            title={meta.label}
          >
            {meta.icon && (
              <Image
                src={meta.icon}
                alt={meta.label}
                height={16}
                width={16}
                className={`h-auto${account.provider === 'github' ? ' dark:invert' : ''}`}
              />
            )}
            {accounts.length > 1 && (
              <button
                type='button'
                onClick={() => handleUnlink(account)}
                className='absolute inset-0 flex items-center justify-center rounded-lg bg-danger/90 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
                title={`Unlink ${meta.label}`}
              >
                <Trash2Icon className='size-3.5 text-white' />
              </button>
            )}
          </div>
        )
      })}
      <button
        type='button'
        onClick={handleLinkAccount}
        className='w-8 h-8 flex items-center justify-center rounded-lg border border-dashed border-border-light text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors cursor-pointer'
        title='Link another account'
      >
        <LinkIcon className='size-3.5' />
      </button>
    </div>
  )
}

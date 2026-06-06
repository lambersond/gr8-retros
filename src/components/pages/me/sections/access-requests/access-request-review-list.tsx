'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/section-card'
import type { AccessRequestReviewListProps } from './types'

export function AccessRequestReviewList({
  requests,
}: Readonly<AccessRequestReviewListProps>) {
  const [items, setItems] = useState(requests)

  if (items.length === 0) return

  const act =
    (settingsId: string, userId: string, action: 'approve' | 'reject') =>
    async () => {
      const res = await fetch(
        `/api/board-settings/${settingsId}/access-request`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterUserId: userId, action }),
        },
      )
      if (res.ok) {
        setItems(prev =>
          prev.filter(
            i => !(i.settingsId === settingsId && i.user.id === userId),
          ),
        )
      }
    }

  return (
    <SectionCard
      label={`Access Requests to Review (${items.length})`}
      className='flex flex-col gap-4'
    >
      <ul className='flex flex-col gap-2'>
        {items.map(item => (
          <li
            key={`${item.settingsId}:${item.user.id}`}
            className='flex items-center justify-between gap-3 rounded-xl px-4 py-3 bg-card border border-border-light'
          >
            <div className='min-w-0'>
              <p className='text-sm font-bold text-text-primary truncate'>
                {item.user.name ?? 'Someone'}
              </p>
              <p className='text-xs text-text-secondary truncate'>
                wants to join {item.settings.retroSession.name ?? 'a board'}
              </p>
            </div>
            <div className='flex gap-2 items-center flex-shrink-0'>
              <button
                onClick={act(item.settingsId, item.user.id, 'approve')}
                className='px-3 py-1 text-sm font-medium rounded bg-primary/85 hover:bg-primary text-text-primary cursor-pointer'
              >
                Approve
              </button>
              <button
                onClick={act(item.settingsId, item.user.id, 'reject')}
                className='px-3 py-1 text-sm font-medium rounded bg-danger/85 hover:bg-danger text-white cursor-pointer'
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

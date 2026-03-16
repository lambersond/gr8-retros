'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { ActionItemRow } from './action-item-row'
import { SectionCard } from '@/components/section-card'
import type { ActionItemsListProps } from './types'

export function ActionItemsList({
  items = [],
}: Readonly<ActionItemsListProps>) {
  const [doneIds, setDoneIds] = useState<Set<string>>(
    () => new Set(items.filter(i => i.isDone).map(i => i.id)),
  )

  const toggle = useCallback(
    async (id: string) => {
      const isDone = !doneIds.has(id)

      setDoneIds(prev => {
        const next = new Set(prev)
        if (isDone) {
          next.add(id)
        } else {
          next.delete(id)
        }
        return next
      })

      try {
        await fetch('/api/action-item/done', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionItemId: id, isDone }),
        })
      } catch {
        setDoneIds(prev => {
          const next = new Set(prev)
          if (isDone) {
            next.delete(id)
          } else {
            next.add(id)
          }
          return next
        })
      }
    },
    [doneIds],
  )

  const pending = useMemo(
    () => items.filter(i => !doneIds.has(i.id)),
    [items, doneIds],
  )
  const done = useMemo(
    () => items.filter(i => doneIds.has(i.id)),
    [items, doneIds],
  )

  const prevPendingCount = useRef(pending.length)

  useEffect(() => {
    const prev = prevPendingCount.current
    prevPendingCount.current = pending.length

    if (prev > 0 && pending.length === 0) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
    }
  }, [pending.length])

  return (
    <SectionCard
      label={
        <div className='flex items-center justify-between'>
          My Action Items
          <div className='flex items-center gap-3 text-md'>
            <span>
              <span className='text-success font-semibold tracking-tight'>
                {done.length}
              </span>{' '}
              done
            </span>
            <span>
              <span className='text-warning font-semibold tracking-tight'>
                {pending.length}
              </span>{' '}
              pending
            </span>
          </div>
        </div>
      }
      className='flex flex-col gap-4'
    >
      {items.length === 0 ? (
        <p className='text-sm text-slate-500 text-center py-4'>
          No action items assigned.
        </p>
      ) : (
        <ul className='flex flex-col gap-2'>
          {[...pending, ...done].map(item => (
            <ActionItemRow
              key={item.id}
              item={item}
              isDone={doneIds.has(item.id)}
              onToggle={toggle}
            />
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

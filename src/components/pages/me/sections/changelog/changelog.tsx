'use client'

import { ChangelogList } from './changelog-list'
import { SectionCard } from '@/components/section-card'
import { useChangelog } from '@/providers/changelog'

const SKELETON_ROWS = ['a', 'b', 'c']

export function Changelog() {
  const { ready, entries } = useChangelog()
  if (!ready) return <ChangelogSkeleton />
  if (entries.length === 0) return
  return <ChangelogList />
}

function ChangelogSkeleton() {
  return (
    <SectionCard
      label={<span className='block h-3 w-24 animate-pulse rounded bg-hover' />}
      className='flex flex-col gap-2 mt-2'
    >
      <ul className='flex flex-col divide-y divide-border-light'>
        {SKELETON_ROWS.map(row => (
          <li
            key={row}
            className='flex animate-pulse flex-col gap-2 py-3 first:pt-2'
          >
            <div className='flex items-center justify-between gap-3'>
              <div className='h-3.5 w-40 rounded bg-hover' />
              <div className='h-3 w-16 rounded bg-hover/60' />
            </div>
            <div className='h-3 w-full rounded bg-hover/60' />
            <div className='h-3 w-3/4 rounded bg-hover/60' />
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

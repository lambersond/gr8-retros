'use client'

import { format } from 'date-fns'
import { ArrowUpRight } from 'lucide-react'
import { SectionCard } from '@/components/section-card'
import { useChangelog } from '@/providers/changelog'

// The Sleekplan SDK is bootstrapped globally in src/app/layout.tsx and attaches
// $sleek once loaded. open('changelog') shows the full panel; open('changelog.ID')
// deep-links to a single entry (falling back to the list if the id form differs).
function openChangelog(id?: number) {
  const sleek = (globalThis as any).$sleek
  sleek?.open?.(id === undefined ? 'changelog' : `changelog.${id}`)
}

function formatDate(date: string) {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? date : format(parsed, 'PP')
}

export function ChangelogList() {
  const { entries, isUnviewed, markViewed, markAllViewed } = useChangelog()

  const handleOpenEntry = (id: number) => {
    markViewed(id)
    openChangelog(id)
  }

  const handleViewAll = () => {
    markAllViewed()
    openChangelog()
  }

  return (
    <SectionCard
      label={
        <div className='flex items-center justify-between'>
          What&apos;s New
          <button
            type='button'
            onClick={handleViewAll}
            className='flex items-center gap-1 text-xs font-semibold tracking-wide uppercase text-primary hover:underline cursor-pointer'
          >
            View all
            <ArrowUpRight className='size-3.5' />
          </button>
        </div>
      }
      className='flex flex-col gap-2 mt-2'
    >
      <ul className='flex flex-col divide-y divide-border-light'>
        {entries.map(item => (
          <li key={item.id}>
            <button
              type='button'
              onClick={() => handleOpenEntry(item.id)}
              className='group flex w-full flex-col gap-1 py-3 text-left first:pt-2 cursor-pointer'
            >
              <div className='flex items-baseline justify-between gap-3'>
                <span className='flex items-center gap-2 font-semibold text-text-primary transition-colors group-hover:text-primary'>
                  {isUnviewed(item.id) && (
                    <span
                      aria-hidden
                      className='inline-block size-2 shrink-0 rounded-full bg-secondary'
                    />
                  )}
                  {item.title}
                </span>
                <time className='shrink-0 text-xs text-text-secondary'>
                  {formatDate(item.date)}
                </time>
              </div>
              {item.excerpt && (
                <span className='text-sm text-text-secondary line-clamp-2'>
                  {item.excerpt}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

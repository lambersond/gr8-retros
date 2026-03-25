import clsx from 'classnames'
import { Square, SquareCheckBig } from 'lucide-react'
import Link from 'next/link'
import { IconButton, Tooltip } from '@/components/common'
import type { ActionItemRowProps } from './types'

export function ActionItemRow({
  item,
  isDone,
  onToggle,
}: Readonly<ActionItemRowProps>) {
  const handleToggle = () => onToggle(item.id)

  return (
    <li
      className={clsx(
        'flex items-center gap-3 rounded-xl border border-[#f0f0f0] px-4 py-3 transition-colors',
        {
          'opacity-50': isDone,
          'bg-slate-50': !isDone,
        },
      )}
    >
      <IconButton
        intent='custom'
        className='text-ai-checkbox hover:bg-ai-checkbox/10'
        icon={isDone ? SquareCheckBig : Square}
        onClick={handleToggle}
      />
      <div className='flex-1 min-w-0'>
        <Tooltip title={item.card?.content}>
          <Link
            href={`/retro/${item.card.retroSessionId}`}
            className={clsx(
              'text-sm font-medium leading-snug hover:underline',
              {
                'line-through text-text-secondary': isDone,
                'text-text-primary': !isDone,
              },
            )}
          >
            {item.content}
          </Link>
        </Tooltip>
        {item.card?.content && (
          <p className='text-[11px] text-text-secondary mt-0.5'>
            from &ldquo;{item.card.content}&rdquo;
          </p>
        )}
      </div>
    </li>
  )
}

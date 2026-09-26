import clsx from 'clsx'
import {
  Check,
  ChevronsRight,
  Combine,
  MessagesSquare,
  NotebookPen,
  Vote,
  type LucideIcon,
} from 'lucide-react'
import { Info } from '@/components/common'
import { GUIDED_PHASE_ORDER, GuidedPhase } from '@/enums'

const PHASE_META: Record<
  GuidedPhase,
  { label: string; Icon: LucideIcon; hint: string }
> = {
  [GuidedPhase.REFLECT]: {
    label: 'Reflect',
    Icon: NotebookPen,
    hint: 'Add your own reflections. Everyone writes privately; other cards stay hidden until the group moves on.',
  },
  [GuidedPhase.GROUP]: {
    label: 'Group',
    Icon: Combine,
    hint: 'Drag similar cards together to group related ideas.',
  },
  [GuidedPhase.VOTE]: {
    label: 'Vote',
    Icon: Vote,
    hint: 'Vote for the topics worth discussing, then hit the “I’m done” button.',
  },
  [GuidedPhase.DISCUSS]: {
    label: 'Discuss',
    Icon: MessagesSquare,
    hint: 'Work through the top voted topics and capture action items.',
  },
}

export function PhaseTimeline({ current }: Readonly<{ current: GuidedPhase }>) {
  const currentIndex = GUIDED_PHASE_ORDER.indexOf(current)

  return (
    <ol className='flex items-center gap-1 sm:gap-2'>
      {GUIDED_PHASE_ORDER.map((phase, i) => {
        const { label, Icon, hint } = PHASE_META[phase]
        const isCurrent = i === currentIndex
        const isDone = i < currentIndex

        return (
          <li key={phase} className='flex items-center gap-1 sm:gap-2'>
            <div
              className={clsx(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold transition-colors',
                isCurrent && 'bg-primary text-text-primary',
                isDone && 'text-success',
                !isCurrent && !isDone && 'text-text-secondary',
              )}
            >
              {isDone ? (
                <Check className='size-4' />
              ) : (
                <Icon className='size-4' />
              )}
              <span className='hidden sm:inline'>{label}</span>
              {isCurrent && <Info info={hint} className='text-white' />}
            </div>
            {i < GUIDED_PHASE_ORDER.length - 1 && (
              <ChevronsRight
                aria-hidden
                className={clsx(
                  'size-4 shrink-0',
                  isDone ? 'text-success' : 'text-text-tertiary',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

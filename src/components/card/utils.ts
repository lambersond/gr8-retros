import clsx from 'classnames'
import type { BoardPermissions } from '@/lib/roles'

export function upvoteTextClasses(isUpvoted: boolean, upvotes: number) {
  return clsx(
    {
      'text-success': isUpvoted,
      'text-text-tertiary': !isUpvoted && upvotes === 0,
      'text-text-secondary': !isUpvoted && upvotes > 0,
    },
    'text-md -mt-0.5',
  )
}

export function upvoteArrowButtonClasses(
  isUpvoted: boolean,
  boardPermissions: BoardPermissions,
) {
  const canUpvote = boardPermissions['upvoting.restricted.canUpvote']

  return clsx({
    'text-success hover:text-warning': isUpvoted && canUpvote,
    'text-text-secondary hover:text-text-primary': !isUpvoted && canUpvote,
    'cursor-not-allowed opacity-50': !canUpvote,
    'cursor-pointer': canUpvote,
  })
}

export function itemClasses(isDiscussed: boolean) {
  return clsx(
    {
      'text-text-secondary line-through group-hover:no-underline': isDiscussed,
      'text-text-primary': !isDiscussed,
    },
    'lg:text-lg xl:text-xl font-bold flex-1 -mt-1',
  )
}

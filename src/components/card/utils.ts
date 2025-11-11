import clsx from 'classnames'

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

export function upvoteArrowButtonClasses(isUpvoted: boolean) {
  return clsx(
    {
      'text-success hover:text-warning': isUpvoted,
      'text-text-tertiary hover:text-text-primary': !isUpvoted,
    },
    'flex items-center text-sm cursor-pointer',
  )
}

export function itemClasses(isDiscussed: boolean) {
  return clsx(
    {
      'text-text-secondary line-through group-hover:no-underline': isDiscussed,
      'text-text-primary': !isDiscussed,
    },
    'lg:text-lg xl:text-xl',
  )
}

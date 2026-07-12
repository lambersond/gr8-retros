import clsx from 'clsx'

export function itemClasses(isDiscussed: boolean) {
  return clsx(
    {
      'text-text-secondary line-through group-hover:no-underline': isDiscussed,
      'text-text-primary': !isDiscussed,
    },
    'lg:text-lg xl:text-xl font-bold flex-1 min-w-0 wrap-anywhere -mt-1',
  )
}

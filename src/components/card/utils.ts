import clsx from 'classnames'

export function itemClasses(isDiscussed: boolean) {
  return clsx(
    {
      'text-text-secondary line-through group-hover:no-underline': isDiscussed,
      'text-text-primary': !isDiscussed,
    },
    'lg:text-lg xl:text-xl font-bold flex-1 -mt-1',
  )
}

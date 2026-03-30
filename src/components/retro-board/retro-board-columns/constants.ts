import clsx from 'classnames'

export const COLUMN_CONTAINER_CLASSES = clsx(
  'flex-1 min-h-0 overflow-hidden',
  'flex gap-3 sm:gap-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth py-3 [-webkit-overflow-scrolling:touch]',
  'lg:grid lg:grid-cols-4 lg:gap-3 lg:p-3 lg:overflow-hidden lg:px-3',
)

export const COLUMN_CLASSES = clsx(
  'snap-start w-full px-3 shrink-0 min-h-0',
  'sm:w-1/2 sm:px-2',
  'lg:snap-none lg:w-auto lg:px-0 lg:shrink lg:min-h-full',
)

import clsx from 'clsx'

export const COLUMN_CONTAINER_CLASSES = clsx(
  'flex-1 min-h-0 overflow-hidden',
  'flex gap-3 sm:gap-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth py-3 [-webkit-overflow-scrolling:touch]',
)

export const COLUMN_CLASSES = clsx(
  'snap-start shrink-0 min-h-0',
  'px-3 sm:px-2',
  'w-full min-w-[320px]', // < md: 1 column at a time
  'md:w-1/2', // md: 2 columns
  'lg:w-1/3', // lg: 3 columns
  'xl:flex-1 xl:max-w-[420px]', // xl+: equal flex from basis-0, cap at 420px
)

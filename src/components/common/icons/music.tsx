import clsx from 'classnames'

type MusicIconProps = {
  bars?: number
  height?: 'sm' | 'md' | 'lg'
  intent?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
  isPlaying?: boolean
}

export function MusicIcon({
  bars = 9,
  height = 'md',
  intent = 'primary',
  isPlaying = false,
}: Readonly<MusicIconProps>) {
  const heightClass = clsx({
    'h-4': height === 'sm',
    'h-8': height === 'md',
    'h-10': height === 'lg',
  })

  const widthClass = clsx(
    {
      'w-0': !isPlaying,
      'w-full': isPlaying,
    },
    'transition-width duration-1000 ease-in-out',
  )

  const intentClass = clsx({
    'bg-primary': intent === 'primary',
    'bg-secondary': intent === 'secondary',
    'bg-tertiary': intent === 'tertiary',
    'bg-info': intent === 'info',
    'bg-success': intent === 'success',
    'bg-warning': intent === 'warning',
    'bg-danger': intent === 'danger',
  })

  const visualizerClass = clsx('visualizer', heightClass, widthClass)
  const barClass = clsx('bar', intentClass)

  return (
    <div className={visualizerClass}>
      {Array.from({ length: bars }, (_, i) => (
        <div className={barClass} key={`bar-${i}`} />
      ))}
    </div>
  )
}

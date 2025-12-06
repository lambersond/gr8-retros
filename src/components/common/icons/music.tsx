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
}

export function MusicIcon({
  bars = 9,
  height = 'md',
  intent = 'primary',
}: Readonly<MusicIconProps>) {
  const heightClass = clsx({
    'h-4': height === 'sm',
    'h-8': height === 'md',
    'h-10': height === 'lg',
  })

  const intentClass = clsx({
    'bg-primary': intent === 'primary',
    'bg-secondary': intent === 'secondary',
    'bg-tertiary': intent === 'tertiary',
    'bg-info': intent === 'info',
    'bg-success': intent === 'success',
    'bg-warning': intent === 'warning',
    'bg-danger': intent === 'danger',
  })

  const visualizerClass = clsx('visualizer', heightClass)
  const barClass = clsx('bar', intentClass)

  return (
    <div className={visualizerClass}>
      {Array.from({ length: bars }, (_, i) => (
        <div className={barClass} key={`bar-${i}`} />
      ))}
    </div>
  )
}

import clsx from 'clsx'
import { InfoIcon } from 'lucide-react'
import { Tooltip } from '../tooltip'

export function Info({
  info,
  className,
}: Readonly<{ info: string; className?: string }>) {
  return (
    <Tooltip title={info}>
      <InfoIcon
        className={clsx('size-4 min-w-4 min-h-4', className ?? 'text-info/80')}
      />
    </Tooltip>
  )
}

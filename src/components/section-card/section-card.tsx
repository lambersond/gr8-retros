import clsx from 'classnames'
import type { SectionCardProps } from './types'

export function SectionCard({
  children,
  className = '',
  label,
}: Readonly<SectionCardProps>) {
  return (
    <div
      className={clsx(
        'rounded-2xl py-6 px-8 bg-paper shadow-sm border border-border-light',
        className,
      )}
    >
      {label && (
        <span className='text-xs font-semibold tracking-wide uppercase text-text-secondary'>
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

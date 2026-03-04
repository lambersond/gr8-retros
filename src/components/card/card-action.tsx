'use client'

import clsx from 'classnames'
import type { CardActionProps } from './types'

export function CardAction({
  icon,
  text,
  onClick,
  textClasses = '',
  buttonClasses = '',
  amount,
}: Readonly<CardActionProps>) {
  return (
    <button
      className={clsx(
        'group/action size-6 rounded-full flex items-center justify-center items-center px-1.5 w-fit text-xs rounded-full transition-colors',
        buttonClasses,
      )}
      onClick={onClick}
    >
      {icon}
      {amount !== undefined && (
        <p className={clsx('text-sm ml-0.5', textClasses)}>{amount}</p>
      )}
      <p
        className={clsx(
          'overflow-hidden max-w-0 group-hover/action:max-w-40 transition-all delay-100 duration-300 ml-0 group-hover/action:ml-1 text-xs whitespace-nowrap tracking-tight',
          textClasses,
        )}
      >
        {text}
      </p>
    </button>
  )
}

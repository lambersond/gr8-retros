'use client'

import { useEffect, useId, useState } from 'react'
import clsx from 'classnames'
import { CheckSquare, Square } from 'lucide-react'
import { isLargeSize, isMediumSize, isSmallSize } from '../utils'
import type { CheckboxProps } from './types'

export function Checkbox({
  label,
  register,
  name = 'checkbox',
  registerOptions,
  size = 'md',
  labelClassName = 'text-text-primary',
  defaultChecked,
  disabled = false,
  checked,
  onChange,
  id,
  ...props
}: Readonly<CheckboxProps>) {
  const reactId = useId()
  const inputId = id ?? `${name}-${reactId}`

  const isControlled = typeof checked === 'boolean'
  const [internalChecked, setInternalChecked] = useState<boolean>(
    Boolean(defaultChecked),
  )

  useEffect(() => {
    if (isControlled) setInternalChecked(Boolean(checked))
  }, [checked, isControlled])

  const iconChecked = isControlled ? Boolean(checked) : internalChecked

  const classes = clsx(
    {
      'size-4': isSmallSize(size),
      'size-6': isMediumSize(size),
      'size-8': isLargeSize(size),
      'opacity-50 cursor-not-allowed': disabled,
    },
    'text-info peer-hover:text-info/80 duration-200 ease-in-out',
  )

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (!isControlled) setInternalChecked(event.target.checked)
    onChange?.(event)
  }

  return (
    <label
      className={clsx(
        {
          'text-sm': isSmallSize(size),
          'text-md': isMediumSize(size),
          'text-lg': isLargeSize(size),
          'cursor-pointer': !disabled,
        },
        'inline-flex items-center',
        labelClassName,
      )}
      htmlFor={inputId}
    >
      <input
        id={inputId}
        name={name}
        type='checkbox'
        className='sr-only peer'
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={handleChange}
        {...register?.(name, registerOptions)}
        {...props}
        disabled={disabled}
      />

      {iconChecked ? (
        <CheckSquare className={`${classes} text-info`} />
      ) : (
        <Square className={`${classes} text-secondary`} />
      )}

      <p className='ml-2 select-none text-text-primary'>{label}</p>
    </label>
  )
}

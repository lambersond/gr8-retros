'use client'

import { useState } from 'react'
import type { NumberIncrementorProps } from './types'

export function NumberIncrementor({
  defaultValue = 0,
  value: controlledValue,
  onChange,
}: Readonly<NumberIncrementorProps>) {
  const [internalValue, setInternalValue] = useState(defaultValue)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const updateValue = (next: number) => {
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  const handleDecrement = () => updateValue(value - 1)
  const handleIncrement = () => updateValue(value + 1)

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = event => {
    const parsed = Number.parseInt(event.target.value, 10)
    if (!Number.isNaN(parsed)) updateValue(parsed)
  }

  return (
    <div
      className=' w-fit flex items-center border border-gray-300 rounded-md overflow-hidden bg-white
        focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10'
    >
      <button
        onClick={handleDecrement}
        className='size-8 flex items-center justify-center bg-gray-50 border-none
          cursor-pointer text-text-secondary text-base font-medium transition-all
          duration-200 select-none hover:bg-gray-200 hover:text-text-primary
          active:bg-gray-300 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50
          disabled:text-text-secondary disabled:hover:bg-gray-50 disabled:hover:text-text-secondary'
      >
        -
      </button>
      <input
        type='number'
        value={value}
        className='
          w-8 h-8 border-none text-center text-sm text-text-primary bg-white
          outline-none font-medium
          [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0
          [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0
          [&[type=number]]:[-moz-appearance:textfield]
        '
        onChange={handleInputChange}
      />
      <button
        onClick={handleIncrement}
        className='size-8 flex items-center justify-center bg-gray-50 border-none
          cursor-pointer text-text-secondary text-base font-medium transition-all
          duration-200 select-none hover:bg-gray-200 hover:text-text-primary
          active:bg-gray-300 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50
          disabled:text-text-secondary disabled:hover:bg-gray-50 disabled:hover:text-text-secondary'
      >
        +
      </button>
    </div>
  )
}

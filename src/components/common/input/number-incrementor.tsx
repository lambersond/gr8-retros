'use client'

import { useState } from 'react'
import type { NumberIncrementorProps } from './types'

export function NumberIncrementor({
  defaultValue = 0,
  onChange,
}: Readonly<NumberIncrementorProps>) {
  const [value, setValue] = useState(defaultValue)

  const handleDecrement = () => {
    const newValue = value - 1
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleIncrement = () => {
    const newValue = value + 1
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = event => {
    const newValue = Number.parseInt(event.target.value, 10)
    if (!Number.isNaN(newValue)) {
      setValue(newValue)
      onChange?.(newValue)
    }
  }

  return (
    <div
      className=' w-fit flex items-center border border-gray-300 rounded-md overflow-hidden bg-white
        focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10'
    >
      <button
        onClick={handleDecrement}
        className='size-8 flex items-center justify-center bg-gray-50 border-none
          cursor-pointer text-gray-600 text-base font-medium transition-all
          duration-200 select-none hover:bg-gray-200 hover:text-gray-700
          active:bg-gray-300 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50
          disabled:text-gray-600 disabled:hover:bg-gray-50 disabled:hover:text-gray-600'
      >
        -
      </button>
      <input
        type='number'
        value={value}
        className='
          w-12 h-8 border-none text-center text-sm text-gray-700 bg-white
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
          cursor-pointer text-gray-600 text-base font-medium transition-all
          duration-200 select-none hover:bg-gray-200 hover:text-gray-700
          active:bg-gray-300 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50
          disabled:text-gray-600 disabled:hover:bg-gray-50 disabled:hover:text-gray-600'
      >
        +
      </button>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import clsx from 'classnames'
import { NumberInputProps } from './types'

export function NumberInput({
  defaultValue,
  disabled = false,
  onChange,
  label,
  title,
  max = Number.POSITIVE_INFINITY,
  min = 1,
  debounceMs = 500,
  showRangeHint = false,
}: Readonly<NumberInputProps>) {
  const [value, setValue] = useState(defaultValue.toString())
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    setValue(defaultValue.toString())
  }, [defaultValue])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const numValue = Number.parseInt(inputValue, 10)

    if (inputValue === '' || Number.isNaN(numValue)) {
      return
    }

    if (numValue < min) {
      debounceTimerRef.current = setTimeout(() => {
        setValue(min.toString())
        onChange(min)
      }, debounceMs)
      return
    }

    if (numValue > max) {
      debounceTimerRef.current = setTimeout(() => {
        setValue(max.toString())
        onChange(max)
      }, debounceMs)
      return
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(numValue)
    }, debounceMs)
  }

  const handleBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const numValue = Number.parseInt(value, 10)

    if (value === '' || Number.isNaN(numValue)) {
      setValue(defaultValue.toString())
      onChange(defaultValue)
      return
    }

    if (numValue < min) {
      setValue(min.toString())
      onChange(min)
      return
    }

    if (numValue > max) {
      setValue(max.toString())
      onChange(max)
      return
    }

    onChange(numValue)
  }

  return (
    <div className='flex flex-col text-text-primary'>
      <p className='mb-1 text-sm font-medium'>{title}</p>
      <div
        className={clsx(
          'flex min-w-32 max-w-56 w-fit rounded border transition-all border-border-light bg-paper/50 rounded-md items-center overflow-hidden',
          {
            'hover:shadow-md hover:border-border-dark': !disabled,
            'cursor-not-allowed': disabled,
          },
        )}
      >
        <input
          type='number'
          min={min}
          max={max}
          disabled={disabled}
          value={value}
          className={clsx(
            'h-10 text-lg text-center min-w-16 flex-1 bg-paper rounded-r-lg focus:outline-none',
            { 'opacity-80 cursor-not-allowed': disabled },
          )}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className='h-10 flex items-center justify-center px-3 bg-tertiary/10'>
          {label}
        </p>
      </div>
      {showRangeHint && (
        <p className='text-xs text-text-secondary mt-1'>
          Range: {min} - {max}
        </p>
      )}
    </div>
  )
}

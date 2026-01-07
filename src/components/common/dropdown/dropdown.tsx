'use client'

import { useState, useRef, useEffect } from 'react'
import clsx from 'classnames'
import { ChevronDown } from 'lucide-react'
import { createPortal } from 'react-dom'
import type { DropdownOption, DropdownProps } from './types'

// Size variant configurations
const SIZE_VARIANTS = {
  sm: {
    button: 'pl-3 pr-1.5 py-1.5 text-sm',
    icon: 'size-4',
    option: 'px-3 py-1.5 text-sm',
    searchInput: 'px-2 py-1.5 text-xs',
    label: 'text-xs',
  },
  md: {
    button: 'pl-4 pr-2 py-2 text-md',
    icon: 'size-5',
    option: 'px-4 py-2 text-md',
    searchInput: 'px-3 py-2 text-sm',
    label: 'text-sm',
  },
  lg: {
    button: 'pl-5 pr-2.5 py-2.5 text-lg',
    icon: 'size-6',
    option: 'px-5 py-3 text-lg',
    searchInput: 'px-4 py-2.5 text-base',
    label: 'text-base',
  },
} as const

export function Dropdown<S, T>({
  options,
  onSelect,
  width = 'w-72',
  label,
  name = 'dropdown',
  selected,
  defaultEmpty = false,
  placeholder = 'No options available',
  searchable = false,
  searchPlaceholder = 'Search...',
  size = 'md',
  ...props
}: Readonly<DropdownProps<S, T>>) {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState(() =>
    defaultEmpty || !options?.[0]
      ? { id: 'default-empty', label: placeholder }
      : options[0],
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get size variant classes
  const sizeClasses = SIZE_VARIANTS[size]

  // Filter options based on search term
  const filteredOptions =
    searchable && searchTerm
      ? options.filter(
          option =>
            option.searchText
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ?? false,
        )
      : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (selected) {
      setChoice(selected)
    }
  }, [selected])

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })

      // Focus search input when dropdown opens (if searchable)
      if (searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 0)
      }
    }
  }, [open, searchable])

  const handleSelect = (option: DropdownOption<S, T>) => () => {
    setChoice(option)
    onSelect(option)
    setOpen(false)
    setSearchTerm('')
  }

  const handleToggle = () => {
    setOpen(!open)
    if (!open) {
      setSearchTerm('')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
      setSearchTerm('')
    } else if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
      e.preventDefault()
      // Focus first option or implement keyboard navigation
    }
  }

  const dropdownList = open && (
    <div
      ref={dropdownRef}
      className='fixed bg-page shadow-2xl rounded-lg overflow-hidden z-[9999] max-h-66 mt-1'
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
      }}
    >
      {searchable && (
        <div className='p-2 border-b border-border'>
          <input
            ref={searchInputRef}
            type='text'
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            className={clsx(
              'w-full bg-page border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-text-primary placeholder-text-secondary',
              sizeClasses.searchInput,
            )}
          />
        </div>
      )}
      <div className='cursor-pointer max-h-52 overflow-y-auto'>
        {filteredOptions.length > 0 ? (
          filteredOptions.map(option => (
            <button
              key={String(option.id)}
              data-testid={`Dropdown__option-${option.id}`}
              onClick={handleSelect(option)}
              className={clsx(
                'w-full text-left text-text-secondary hover:text-text-primary hover:bg-tertiary/50 cursor-pointer',
                sizeClasses.option,
              )}
            >
              {option.label}
            </button>
          ))
        ) : (
          <div
            className={clsx('text-text-secondary italic', sizeClasses.option)}
          >
            No options found
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className='relative inline-flex flex-col text-left rounded-md w-full'>
      {!!label && (
        <label
          className={clsx(
            'text-text-secondary font-bold uppercase',
            sizeClasses.label,
          )}
          htmlFor={name}
        >
          {label}
          {props.required && <sup>*</sup>}
        </label>
      )}
      <button
        ref={buttonRef}
        name={name}
        type='button'
        data-testid='Dropdown__button'
        onClick={handleToggle}
        className={clsx(
          'inline-flex justify-between rounded-md border border-tertiary bg-page text-text-primary focus:outline-none cursor-pointer hover:bg-page/75',
          width,
          sizeClasses.button,
        )}
      >
        {choice.label}
        <ChevronDown
          className={clsx('ml-auto text-secondary/80', sizeClasses.icon)}
        />
      </button>
      {globalThis.window !== undefined &&
        createPortal(dropdownList, document.body)}
    </div>
  )
}

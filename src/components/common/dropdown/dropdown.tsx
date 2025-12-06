'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { createPortal } from 'react-dom'
import type { DropdownOption, DropdownProps } from './types'

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
            className='w-full px-3 py-2 text-sm bg-page border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-text-primary placeholder-text-secondary'
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
              className='w-full text-left px-4 py-2 text-md text-text-secondary hover:text-text-primary hover:bg-tertiary/50 cursor-pointer'
            >
              {option.label}
            </button>
          ))
        ) : (
          <div className='px-4 py-2 text-md text-text-secondary italic'>
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
          className='text-sm text-text-secondary font-bold uppercase'
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
        className={`
          inline-flex justify-between ${width} rounded-md border border-tertiary
          pl-4 pr-2 py-2 bg-page text-md text-text-primary focus:outline-none
          cursor-pointer hover:bg-page/75
        `}
      >
        {choice.label}
        <ChevronDown className='ml-auto text-secondary/80 size-5' />
      </button>
      {globalThis.window !== undefined &&
        createPortal(dropdownList, document.body)}
    </div>
  )
}

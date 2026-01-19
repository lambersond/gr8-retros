'use client'

import { useState, useRef, useEffect } from 'react'
import clsx from 'classnames'
import { ChevronDown, X, Check } from 'lucide-react'
import { createPortal } from 'react-dom'
import type { DropdownOption, DropdownProps } from './types'

const SIZE_VARIANTS = {
  sm: {
    button: 'pl-3 pr-1.5 py-1.5 text-sm',
    icon: 'size-4',
    option: 'px-3 py-1.5 text-sm',
    searchInput: 'px-2 py-1.5 text-xs',
    label: 'text-xs',
    checkbox: 'size-3.5',
    clearButton: 'right-8',
  },
  md: {
    button: 'pl-4 pr-2 py-2 text-md',
    icon: 'size-5',
    option: 'px-4 py-2 text-md',
    searchInput: 'px-3 py-2 text-sm',
    label: 'text-sm',
    checkbox: 'size-4',
    clearButton: 'right-9',
  },
  lg: {
    button: 'pl-5 pr-2.5 py-2.5 text-lg',
    icon: 'size-6',
    option: 'px-5 py-3 text-lg',
    searchInput: 'px-4 py-2.5 text-base',
    label: 'text-base',
    checkbox: 'size-5',
    clearButton: 'right-11',
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
  multiselection = false,
  clearable = false,
  defaultSelectedId,
  ...props
}: Readonly<DropdownProps<S, T>>) {
  const [open, setOpen] = useState(false)
  const [choice, setChoice] = useState(() => {
    if (defaultEmpty) {
      return { id: 'default-empty', label: placeholder }
    }

    if (defaultSelectedId) {
      const defaultOption = options.find(
        option => option.id === defaultSelectedId,
      )
      if (defaultOption) {
        return defaultOption
      }
    }

    return (
      options?.[0] || { id: 'default-empty', label: 'No Options Available' }
    )
  })
  const [selectedItems, setSelectedItems] = useState<DropdownOption<S, T>[]>([])
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
      if (multiselection) {
        setSelectedItems(Array.isArray(selected) ? selected : [selected])
      } else {
        setChoice(selected)
      }
    }
  }, [selected, multiselection])

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })

      if (searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 0)
      }
    }
  }, [open, searchable])

  const handleSingleSelect = (option: DropdownOption<S, T>) => {
    setChoice(option)
    onSelect(option)
    setOpen(false)
    setSearchTerm('')
  }

  const handleMultiSelect = (option: DropdownOption<S, T>) => {
    const isSelected = selectedItems.some(item => item.id === option.id)
    const newSelection = isSelected
      ? selectedItems.filter(item => item.id !== option.id)
      : [...selectedItems, option]

    setSelectedItems(newSelection)
    onSelect(newSelection as any)
  }

  const handleSelectSingle = (option: DropdownOption<S, T>) => () => {
    handleSingleSelect(option)
  }

  const handleSelectMulti = (option: DropdownOption<S, T>) => () => {
    handleMultiSelect(option)
  }

  const handleToggle = () => {
    setOpen(!open)
    if (!open) {
      setSearchTerm('')
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (multiselection) {
      setSelectedItems([])
      onSelect([] as any)
    } else {
      const emptyOption = { id: 'default-empty', label: placeholder }
      setChoice(emptyOption)
      onSelect(emptyOption as any)
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
    }
  }

  const isOptionSelected = (optionId: S | T | 'default-empty') => {
    return selectedItems.some(item => item.id === optionId)
  }

  const getSingleSelectionText = () => {
    return choice.label
  }

  const getMultiSelectionText = () => {
    if (selectedItems.length === 0) {
      return placeholder
    } else if (selectedItems.length === 1) {
      return selectedItems[0].label
    } else {
      return `${selectedItems.length} selected`
    }
  }

  const hasSelection = multiselection
    ? selectedItems.length > 0
    : choice.id !== 'default-empty'

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
              onClick={
                multiselection
                  ? handleSelectMulti(option)
                  : handleSelectSingle(option)
              }
              className={clsx(
                'w-full text-left text-text-secondary hover:text-text-primary hover:bg-tertiary/50 cursor-pointer flex items-center gap-2',
                sizeClasses.option,
                multiselection &&
                  isOptionSelected(option.id) &&
                  'bg-tertiary/30',
              )}
            >
              {multiselection && (
                <div
                  className={clsx(
                    'flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors',
                    sizeClasses.checkbox,
                    isOptionSelected(option.id)
                      ? 'bg-primary border-primary text-white'
                      : 'border-border bg-page',
                  )}
                >
                  {isOptionSelected(option.id) && (
                    <Check className='w-full h-full p-0.5' strokeWidth={3} />
                  )}
                </div>
              )}
              <span className='flex-1'>{option.label}</span>
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
      <div className='relative'>
        <button
          ref={buttonRef}
          name={name}
          type='button'
          data-testid='Dropdown__button'
          onClick={handleToggle}
          className={clsx(
            'inline-flex items-center justify-between rounded-md border border-tertiary bg-page text-text-primary focus:outline-none cursor-pointer hover:bg-page/75 w-full',
            width,
            sizeClasses.button,
          )}
        >
          <span className='flex-1 truncate text-left'>
            {multiselection
              ? getMultiSelectionText()
              : getSingleSelectionText()}
          </span>
          <ChevronDown
            className={clsx('text-secondary/80 ml-auto', sizeClasses.icon)}
          />
        </button>

        {clearable && hasSelection && (
          <button
            type='button'
            onClick={handleClear}
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 hover:bg-tertiary/50 rounded p-0.5 transition-colors z-10',
              sizeClasses.clearButton,
            )}
            aria-label='Clear selection'
          >
            <X className={clsx('text-text-secondary', sizeClasses.icon)} />
          </button>
        )}
      </div>
      {globalThis.window !== undefined &&
        createPortal(dropdownList, document.body)}
    </div>
  )
}

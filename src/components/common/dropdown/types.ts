export type DropdownOption<S = string, T = string> = {
  id: S
  label: React.ReactNode
  searchText?: string
  value?: T
}

export type DropdownProps<S = string, T = string | number> = {
  options: DropdownOption<S, T>[]
  selected?: DropdownOption<S, T>
  onSelect: (option: DropdownOption<S, T>) => void
  label?: string
  name?: string
  required?: boolean
  defaultEmpty?: boolean
  placeholder?: string
  width?: string
  searchable?: boolean
  searchPlaceholder?: string
}

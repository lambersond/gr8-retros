export type NumberInputProps = {
  defaultValue: number
  disabled?: boolean
  onChange: (value: number) => void
  label: string
  title: string
  max?: number
  min?: number
  debounceMs?: number
  showRangeHint?: boolean
}

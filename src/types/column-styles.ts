export type ColorScheme = {
  bg: string
  border: string
  titleBg: string
  titleText: string
}

export type ColumnConfig = {
  label: string
  tagline?: string
  placeholder?: string
  emoji?: string
  light: ColorScheme
  dark: ColorScheme
}

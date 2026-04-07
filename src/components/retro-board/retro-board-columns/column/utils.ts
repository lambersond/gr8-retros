import type { ColorScheme } from '@/types'

export function getWrapperStyles(colors: ColorScheme): React.CSSProperties {
  return {
    backgroundColor: colors.bg,
    borderColor: colors.border,
  }
}

export function getTitleStyles(colors: ColorScheme): React.CSSProperties {
  return {
    backgroundColor: colors.titleBg,
    color: colors.titleText,
  }
}

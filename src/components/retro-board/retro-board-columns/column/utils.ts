import clsx from 'clsx'
import type { ColorScheme } from '@/types'

export function getWrapperClasses() {
  return clsx('flex flex-col min-h-0 h-full rounded-lg border-2 relative')
}

export function getTitleClasses() {
  return clsx('text-xl tracking-tight font-semibold w-full text-left p-3')
}

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

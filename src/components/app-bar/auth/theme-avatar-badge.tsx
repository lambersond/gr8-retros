'use client'

import { useEffect, useState } from 'react'
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const THEME_ICON: Record<string, LucideIcon> = {
  light: Sun,
  system: Monitor,
  dark: Moon,
}

const THEME_LABEL: Record<string, string> = {
  light: 'Light',
  system: 'System',
  dark: 'Dark',
}

// A small badge on the bottom-left of the account avatar showing the active
// color theme. It sits on the avatar (which opens the user popover holding the
// theme toggle) to signal that theme is a per-user setting found there —
// users kept looking for it in the board settings instead.
export function ThemeAvatarBadge() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Theme is only resolved on the client; render nothing until mounted to avoid
  // a hydration mismatch (matches ColorModeToggle).
  if (!mounted) return

  const active = theme ?? 'system'
  const Icon = THEME_ICON[active] ?? Monitor

  return (
    <span
      title={`Theme: ${THEME_LABEL[active] ?? 'System'}`}
      className='absolute -bottom-0.5 -left-0.5 flex items-center justify-center size-4 rounded-full bg-paper border border-border-light text-text-secondary shadow-sm'
    >
      <Icon className='size-2.5' />
    </span>
  )
}

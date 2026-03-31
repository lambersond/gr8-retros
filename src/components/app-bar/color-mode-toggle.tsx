'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Monitor, Moon, Sun, LucideIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

type ColorMode = 'light' | 'system' | 'dark'

const modes: { value: ColorMode; label: string; Icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'dark', label: 'Dark', Icon: Moon },
]

export default function ColorModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => setMounted(true), [])

  const updateSlider = useCallback((index: number) => {
    const btn = buttonRefs.current[index]
    const container = containerRef.current
    if (!btn || !container) return
    const cRect = container.getBoundingClientRect()
    const bRect = btn.getBoundingClientRect()
    setSliderStyle({
      width: bRect.width,
      transform: `translateX(${bRect.left - cRect.left - 4}px)`,
    })
  }, [])

  useEffect(() => {
    const index = modes.findIndex(m => m.value === (theme ?? 'system'))
    updateSlider(index)
  }, [theme, updateSlider])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const index = modes.findIndex(m => m.value === (theme ?? 'system'))
      updateSlider(index)
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [theme, updateSlider])

  if (!mounted) {
    return (
      <>
        {/* Mobile skeleton */}
        <div className='sm:hidden size-9 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700' />
        {/* Desktop skeleton */}
        <div className='hidden sm:block h-9 w-28 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700' />
      </>
    )
  }

  const active = (theme ?? 'system') as ColorMode
  const activeIndex = modes.findIndex(m => m.value === active)
  const { Icon: ActiveIcon, label: activeLabel } = modes[activeIndex]

  const cycleTheme = () => {
    const next = modes[(activeIndex + 1) % modes.length]
    setTheme(next.value)
  }

  return (
    <>
      {/* ── Mobile: single cycling button ─────────────────────────── */}
      <button
        className='
          sm:hidden
          flex items-center justify-center
          size-9 rounded-full
          bg-gray-100 dark:bg-zinc-800
          border border-gray-200 dark:border-zinc-700
          shadow-inner
          text-gray-700 dark:text-zinc-200
          hover:text-gray-900 dark:hover:text-white
          transition-colors duration-150 cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
        '
        onClick={cycleTheme}
        title={`Theme: ${activeLabel} (click to cycle)`}
        aria-label={`Current theme: ${activeLabel}. Click to cycle.`}
      >
        <ActiveIcon size={15} />
      </button>

      {/* ── Desktop: segmented pill ────────────────────────────────── */}
      <div
        ref={containerRef}
        role='radiogroup'
        aria-label='Color mode'
        className='
          hidden sm:inline-flex
          relative items-center gap-1
          rounded-full p-1
          bg-gray-100 dark:bg-zinc-800
          border border-gray-200 dark:border-zinc-700
          shadow-inner
        '
      >
        {/* Sliding pill */}
        <span
          aria-hidden
          className='
            pointer-events-none absolute top-1 h-[calc(100%-8px)]
            rounded-full
            bg-white dark:bg-zinc-600
            shadow-sm
            transition-transform duration-200 ease-[cubic-bezier(0.34,1.2,0.64,1)]
          '
          style={sliderStyle}
        />

        {modes.map(({ value, label, Icon }, i) => {
          const isActive = active === value
          return (
            <button
              key={value}
              ref={el => {
                buttonRefs.current[i] = el
              }}
              role='radio'
              aria-checked={isActive}
              aria-label={label}
              title={label}
              onClick={() => setTheme(value)}
              className={`
                relative z-10 flex items-center justify-center
                size-7 rounded-full
                transition-colors duration-150 select-none cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
                ${
                  isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-zinc-400 hover:text-gray-600 dark:hover:text-zinc-300'
                }
              `}
            >
              <Icon size={15} />
            </button>
          )
        })}
      </div>
    </>
  )
}

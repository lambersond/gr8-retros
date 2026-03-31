'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'

type ColorMode = 'light' | 'system' | 'dark'

const SunIcon = () => (
  <svg
    width='15'
    height='15'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' />
  </svg>
)

const MonitorIcon = () => (
  <svg
    width='15'
    height='15'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <rect x='2' y='3' width='20' height='14' rx='2' />
    <path d='M8 21h8M12 17v4' />
  </svg>
)

const MoonIcon = () => (
  <svg
    width='15'
    height='15'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
  </svg>
)

const modes: { value: ColorMode; label: string; Icon: React.FC }[] = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'system', label: 'System', Icon: MonitorIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
]

export default function ColorModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Avoid hydration mismatch — next-themes only knows the theme client-side
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

  // Render a fixed-size placeholder before mount to avoid layout shift
  if (!mounted) {
    return (
      <div className='h-10 w-[6.5rem] rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700' />
    )
  }

  const active = (theme ?? 'system') as ColorMode

  return (
    <div
      ref={containerRef}
      role='radiogroup'
      aria-label='Color mode'
      className='
        relative inline-flex items-center gap-0.5
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
              w-8 h-8 rounded-full
              transition-colors duration-150 select-none cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
              ${
                isActive
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 dark:text-zinc-400 hover:text-gray-600 dark:hover:text-zinc-300'
              }
            `}
          >
            <Icon />
          </button>
        )
      })}
    </div>
  )
}

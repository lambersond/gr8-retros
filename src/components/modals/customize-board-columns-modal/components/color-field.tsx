import { useEffect, useState } from 'react'
import type { ColorFieldProps } from './types'

export function ColorField({
  label,
  value,
  onChange,
}: Readonly<ColorFieldProps>) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const commit = (v: string) => {
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      onChange(v)
    } else {
      setText(value)
    }
  }

  return (
    <div className='flex flex-col gap-1'>
      <label className='text-[10px] font-semibold uppercase tracking-widest text-text-secondary'>
        {label}
      </label>
      <div className='flex items-center gap-2'>
        <input
          type='color'
          value={value}
          onChange={e => {
            setText(e.target.value)
            onChange(e.target.value)
          }}
          className='size-8 flex-shrink-0 cursor-pointer rounded-md border border-border-light bg-bg-white/60 p-0.5'
        />
        <input
          value={text}
          maxLength={7}
          spellCheck={false}
          onChange={e => setText(e.target.value)}
          onBlur={e => commit(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && commit(text)}
          className='h-8 w-full rounded-md border border-border-light bg-white/60 px-2 font-mono text-sm text-text-primary focus:outline-none'
        />
      </div>
    </div>
  )
}

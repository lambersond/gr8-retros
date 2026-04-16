import { useEffect } from 'react'
import {
  useFloating,
  useDismiss,
  useInteractions,
  offset,
  flip,
  shift,
  FloatingPortal,
} from '@floating-ui/react'
import clsx from 'clsx'
import type { EmojiMatch } from './emoji-data'

type VirtualElement = { getBoundingClientRect: () => DOMRect }

type Props = {
  matches: EmojiMatch[]
  selectedIndex: number
  onSelect: (emoji: EmojiMatch) => void
  onClose: () => void
  virtualRef: React.RefObject<VirtualElement>
}

export function EmojiSuggestions({
  matches,
  selectedIndex,
  onSelect,
  onClose,
  virtualRef,
}: Readonly<Props>) {
  const isOpen = matches.length > 0

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: open => {
      if (!open) onClose()
    },
    placement: 'bottom-start',
    middleware: [offset(11), flip({ padding: 8 }), shift({ padding: 4 })],
  })

  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true })
  const { getFloatingProps } = useInteractions([dismiss])

  useEffect(() => {
    refs.setPositionReference(virtualRef.current)
  }, [refs, virtualRef])

  if (matches.length === 0) return

  return (
    <FloatingPortal>
      <ul
        ref={refs.setFloating}
        style={floatingStyles}
        className='z-1500 max-h-56 overflow-auto rounded-md border border-border-light bg-paper shadow-card'
        {...getFloatingProps()}
      >
        {matches.map((emoji, idx) => {
          const isSelected = idx === selectedIndex
          return (
            <li key={`${emoji.char}-${emoji.name}`}>
              <button
                type='button'
                className={clsx(
                  'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-text-primary',
                  isSelected ? 'bg-primary/10' : 'hover:bg-hover',
                )}
                onMouseDown={e => {
                  e.preventDefault()
                  onSelect(emoji)
                }}
              >
                <span className='text-lg leading-none'>{emoji.char}</span>
                <span className='text-text-secondary'>
                  :{emoji.name.replaceAll(' ', '_')}:
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </FloatingPortal>
  )
}

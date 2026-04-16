'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { EmojiStyle, Theme, type EmojiClickData } from 'emoji-picker-react'
import {
  useFloating,
  useDismiss,
  useInteractions,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

type Props = {
  onEmojiSelect: (emoji: string) => void
}

export function EmojiPickerButton({ onEmojiSelect }: Props) {
  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top-end',
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
  })

  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

  return (
    <>
      <button
        ref={refs.setReference}
        type='button'
        aria-label='Insert emoji'
        className='flex items-center justify-center rounded-md p-1 text-text-secondary hover:text-text-primary hover:bg-hover'
        {...getReferenceProps({
          onMouseDown: e => {
            e.preventDefault()
            setOpen(prev => !prev)
          },
        })}
      >
        <span className='text-lg leading-none'>😀</span>
      </button>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className='z-1500'
            {...getFloatingProps()}
          >
            <EmojiPicker
              theme={Theme.AUTO}
              emojiStyle={EmojiStyle.NATIVE}
              height={350}
              width={300}
              searchDisabled={false}
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
              onEmojiClick={(emojiData: EmojiClickData) => {
                onEmojiSelect(emojiData.emoji)
                setOpen(false)
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

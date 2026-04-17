'use client'

import { useState } from 'react'
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
import { EmojiStyle, Theme, type EmojiClickData } from 'emoji-picker-react'
import dynamic from 'next/dynamic'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

type Props = {
  onEmojiSelect: (emoji: string) => void
  children?: React.ReactNode
  id?: string
  className?: string
}

export function EmojiPickerButton({
  onEmojiSelect,
  children,
  id,
  className,
}: Readonly<Props>) {
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
        id={id}
        ref={refs.setReference}
        type='button'
        aria-label='Insert emoji'
        className={
          className ??
          'flex items-center justify-center rounded-md p-1 text-text-secondary hover:text-text-primary hover:bg-hover'
        }
        {...getReferenceProps({
          onMouseDown: e => {
            e.preventDefault()
            setOpen(prev => !prev)
          },
        })}
      >
        {children ?? <span className='text-lg leading-none'>😀</span>}
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

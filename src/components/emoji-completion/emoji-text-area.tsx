import { forwardRef, useCallback, useRef, type ChangeEvent } from 'react'
import { useMergeRefs } from '@floating-ui/react'
import { EmojiPickerButton } from './emoji-picker-button'
import { EmojiSuggestions } from './emoji-suggestions'
import { useEmojiCompletion } from './use-emoji-completion'
import { TextArea } from '@/components/common'
import type { TextAreaProps } from '@/components/common/textarea/types'

type EmojiTextAreaProps = TextAreaProps & {
  onValueChange?: (value: string) => void
}

export const EmojiTextArea = forwardRef<
  HTMLTextAreaElement,
  EmojiTextAreaProps
>(function EmojiTextArea(
  { onChange, onKeyDown, onValueChange, ...props },
  ref,
) {
  const internalRef = useRef<HTMLTextAreaElement | null>(null)
  const mergedRef = useMergeRefs([ref, internalRef])

  const applyEmojiValue = useCallback(
    (newValue: string, caret: number) => {
      const el = internalRef.current
      if (!el) return
      el.value = newValue
      onValueChange?.(newValue)
      requestAnimationFrame(() => {
        el.setSelectionRange(caret, caret)
        el.focus()
      })
    },
    [onValueChange],
  )

  const emoji = useEmojiCompletion({ onApply: applyEmojiValue })

  const insertEmoji = useCallback(
    (char: string) => {
      const el = internalRef.current
      if (!el) return
      const start = el.selectionStart
      const end = el.selectionEnd
      const newValue = el.value.slice(0, start) + char + el.value.slice(end)
      applyEmojiValue(newValue, start + char.length)
    },
    [applyEmojiValue],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
      emoji.handleInput(e.currentTarget)
    },
    [onChange, emoji.handleInput],
  )

  return (
    <div className='relative'>
      <TextArea
        {...props}
        ref={mergedRef}
        onChange={handleChange}
        onKeyDown={e => {
          if (emoji.handleKeyDown(e)) return
          onKeyDown?.(e)
        }}
      />
      <div className='absolute right-2 -top-2.5 p-0.25 bg-paper rounded-sm border border-border-light'>
        <EmojiPickerButton onEmojiSelect={insertEmoji} />
      </div>
      {emoji.open && (
        <EmojiSuggestions
          matches={emoji.matches}
          selectedIndex={emoji.selectedIndex}
          virtualRef={emoji.virtualRef}
          onClose={emoji.close}
          onSelect={match => {
            const el = internalRef.current
            if (el) emoji.apply(match, el)
          }}
        />
      )}
    </div>
  )
})

import { forwardRef, useCallback, useRef, type ChangeEvent } from 'react'
import { useMergeRefs } from '@floating-ui/react'
import { EmojiPickerButton } from './emoji-picker-button'
import { EmojiSuggestions } from './emoji-suggestions'
import { useEmojiCompletion } from './use-emoji-completion'
import { Input } from '@/components/common'
import type { InputProps } from '@/components/common/input/types'

type EmojiInputProps = InputProps & {
  onValueChange?: (value: string) => void
}

export const EmojiInput = forwardRef<HTMLInputElement, EmojiInputProps>(
  function EmojiInput({ onChange, onKeyDown, onValueChange, ...props }, ref) {
    const internalRef = useRef<HTMLInputElement | null>(null)
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
        const start = el.selectionStart ?? 0
        const end = el.selectionEnd ?? 0
        const newValue = el.value.slice(0, start) + char + el.value.slice(end)
        applyEmojiValue(newValue, start + char.length)
      },
      [applyEmojiValue],
    )

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e)
        emoji.handleInput(e.currentTarget)
      },
      [onChange, emoji.handleInput],
    )

    return (
      <div className='relative'>
        <Input
          {...props}
          ref={mergedRef}
          onChange={handleChange}
          onKeyDown={e => {
            if (emoji.handleKeyDown(e)) return
            onKeyDown?.(e)
          }}
        />
        <div className='absolute right-2 top-1 p-0.25 bg-paper rounded-sm border border-border-light'>
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
  },
)

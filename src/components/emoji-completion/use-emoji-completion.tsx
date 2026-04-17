import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { findUniqueMatch, searchEmojis, type EmojiMatch } from './emoji-data'
import { getCaretRect } from './get-caret-rect'

// `:` preceded by start-of-string or whitespace, then one-or-more shortcode chars
const OPENING_RE = /(^|\s):([\p{L}\p{N}_+-]+)$/u
const CLOSING_RE = /(^|\s):([\p{L}\p{N}_+-]+):$/u

type State = {
  open: boolean
  matches: EmojiMatch[]
  selectedIndex: number
  shortcodeStart: number
}

const CLOSED: State = {
  open: false,
  matches: [],
  selectedIndex: 0,
  shortcodeStart: 0,
}

type Options = {
  onApply: (newValue: string, caret: number) => void
}

export function useEmojiCompletion({ onApply }: Options) {
  const [state, setState] = useState<State>(CLOSED)
  const caretRectRef = useRef<DOMRect>(DOMRect.fromRect())

  const close = useCallback(() => setState(CLOSED), [])

  const handleInput = useCallback(
    (textarea: HTMLTextAreaElement) => {
      const { value } = textarea
      const caret = textarea.selectionStart
      const before = value.slice(0, caret)

      // 1) Closing colon → try unique auto-replace
      const closing = CLOSING_RE.exec(before)
      if (closing) {
        const shortcode = closing[2]
        const unique = findUniqueMatch(shortcode)
        if (unique) {
          const shortcodeLen = closing[0].length - closing[1].length // `:word:`
          const replaceStart = caret - shortcodeLen
          const newValue =
            value.slice(0, replaceStart) + unique.char + value.slice(caret)
          const newCaret = replaceStart + unique.char.length
          onApply(newValue, newCaret)
          setState(CLOSED)
          return
        }
      }

      // 2) Opening `:word` → show suggestions
      const opening = OPENING_RE.exec(before)
      if (opening) {
        const shortcode = opening[2]
        const matches = searchEmojis(shortcode)
        if (matches.length > 0) {
          const shortcodeStart = caret - shortcode.length - 1 // index of `:`
          caretRectRef.current = getCaretRect(textarea, caret)
          setState({
            open: true,
            matches,
            selectedIndex: 0,
            shortcodeStart,
          })
          return
        }
      }

      setState(s => (s.open ? CLOSED : s))
    },
    [onApply],
  )

  const apply = useCallback(
    (emoji: EmojiMatch, textarea: HTMLTextAreaElement) => {
      const { value } = textarea
      const caret = textarea.selectionStart
      const newValue =
        value.slice(0, state.shortcodeStart) + emoji.char + value.slice(caret)
      const newCaret = state.shortcodeStart + emoji.char.length
      onApply(newValue, newCaret)
      setState(CLOSED)
    },
    [onApply, state.shortcodeStart],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>): boolean => {
      if (!state.open || state.matches.length === 0) return false

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          setState(s => ({
            ...s,
            selectedIndex: (s.selectedIndex + 1) % s.matches.length,
          }))
          return true
        }
        case 'ArrowUp': {
          e.preventDefault()
          setState(s => ({
            ...s,
            selectedIndex:
              (s.selectedIndex - 1 + s.matches.length) % s.matches.length,
          }))
          return true
        }
        case 'Enter':
        case 'Tab': {
          e.preventDefault()
          apply(state.matches[state.selectedIndex], e.currentTarget)
          return true
        }
        case 'Escape': {
          e.preventDefault()
          close()
          return true
        }
        default: {
          return false
        }
      }
    },
    [apply, close, state.matches, state.open, state.selectedIndex],
  )

  const virtualRef = useRef({
    getBoundingClientRect: () => caretRectRef.current,
  })

  return {
    open: state.open,
    matches: state.matches,
    selectedIndex: state.selectedIndex,
    virtualRef,
    handleInput,
    handleKeyDown,
    apply,
    close,
  }
}

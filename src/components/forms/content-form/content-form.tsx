import { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { EmojiSuggestions, useEmojiCompletion } from './emoji-completion'
import { EmojiPickerButton } from './emoji-picker-button'
import { type ContentFields, contentResolver } from './schema'
import { Form, TextArea } from '@/components/common'
import { SubmitButton } from '@/components/submit-button'

export function ContentForm({
  title,
  onSubmit,
  defaultContent,
  placeholder = 'We did a great job!',
}: Readonly<any>) {
  const { formState, handleSubmit, register, setValue } =
    useForm<ContentFields>({
      resolver: contentResolver,
      defaultValues: { content: defaultContent },
    })

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { ref: rhfRef, onChange: rhfOnChange, ...rhfRest } = register('content')

  const setRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      rhfRef(el)
      textareaRef.current = el
    },
    [rhfRef],
  )

  const applyEmojiValue = useCallback(
    (newValue: string, caret: number) => {
      const el = textareaRef.current
      if (!el) return
      // Update DOM directly (textarea is uncontrolled) and sync RHF state.
      el.value = newValue
      setValue('content', newValue, { shouldDirty: true, shouldValidate: true })
      requestAnimationFrame(() => {
        el.setSelectionRange(caret, caret)
        el.focus()
      })
    },
    [setValue],
  )

  const emoji = useEmojiCompletion({ onApply: applyEmojiValue })

  const insertEmoji = useCallback(
    (char: string) => {
      const el = textareaRef.current
      if (!el) return
      const start = el.selectionStart
      const end = el.selectionEnd
      const newValue = el.value.slice(0, start) + char + el.value.slice(end)
      const newCaret = start + char.length
      applyEmojiValue(newValue, newCaret)
    },
    [applyEmojiValue],
  )

  const handleOnSubmit = (data: ContentFields) => {
    onSubmit(data.content)
  }

  return (
    <Form title={title} onSubmit={handleSubmit(handleOnSubmit)}>
      <div className='relative'>
        <TextArea
          {...rhfRest}
          ref={setRef}
          data-testid='content-form__content'
          placeholder={placeholder}
          rows={5}
          maxLength={256}
          tabIndex={0}
          error={formState.errors.content?.message}
          defaultValue={defaultContent}
          onChange={e => {
            rhfOnChange(e)
            emoji.handleInput(e.currentTarget)
          }}
          onKeyDown={e => {
            if (emoji.handleKeyDown(e)) return
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(handleOnSubmit)()
            }
          }}
          autoFocus
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
              const el = textareaRef.current
              if (el) emoji.apply(match, el)
            }}
          />
        )}
      </div>
      <SubmitButton />
    </Form>
  )
}

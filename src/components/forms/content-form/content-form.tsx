import { useForm } from 'react-hook-form'
import { type ContentFields, contentResolver } from './schema'
import { Form } from '@/components/common'
import { EmojiTextArea } from '@/components/emoji-completion'
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

  const { ref: rhfRef, onChange: rhfOnChange, ...rhfRest } = register('content')

  const handleOnSubmit = (data: ContentFields) => {
    onSubmit(data.content)
  }

  return (
    <Form title={title} onSubmit={handleSubmit(handleOnSubmit)}>
      <EmojiTextArea
        {...rhfRest}
        ref={rhfRef}
        data-testid='content-form__content'
        placeholder={placeholder}
        rows={5}
        maxLength={256}
        tabIndex={0}
        error={formState.errors.content?.message}
        defaultValue={defaultContent}
        onChange={rhfOnChange}
        onValueChange={value =>
          setValue('content', value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(handleOnSubmit)()
          }
        }}
        autoFocus
      />
      <SubmitButton />
    </Form>
  )
}

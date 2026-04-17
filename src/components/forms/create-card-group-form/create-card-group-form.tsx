import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type Fields, schema } from './schema'
import { Form } from '@/components/common'
import { EmojiInput } from '@/components/emoji-completion'
import { SubmitButton } from '@/components/submit-button'
import type { CreateCardGroupFormProps } from './types'

export function CreateCardGroupForm({
  defaultLabel,
  onSubmit,
}: Readonly<CreateCardGroupFormProps>) {
  const { formState, handleSubmit, register, setValue } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { label: defaultLabel },
  })

  const { ref: rhfRef, onChange: rhfOnChange, ...rhfRest } = register('label')

  const handleOnSubmit = (data: Fields) => {
    onSubmit(data.label)
  }

  return (
    <Form onSubmit={handleSubmit(handleOnSubmit)}>
      <EmojiInput
        {...rhfRest}
        ref={rhfRef}
        label='Group Name'
        placeholder='Enter a name for this group...'
        onChange={rhfOnChange}
        onValueChange={value =>
          setValue('label', value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        error={formState.errors.label?.message}
        autoFocus
        maxLength={64}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit(handleOnSubmit)()
          }
        }}
      />
      <SubmitButton />
    </Form>
  )
}

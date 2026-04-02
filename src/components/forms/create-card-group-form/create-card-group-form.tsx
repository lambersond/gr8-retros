import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type Fields, schema } from './schema'
import { Form, Input } from '@/components/common'
import { SubmitButton } from '@/components/submit-button'
import type { CreateCardGroupFormProps } from './types'

export function CreateCardGroupForm({
  defaultLabel,
  onSubmit,
}: Readonly<CreateCardGroupFormProps>) {
  const { formState, handleSubmit, register } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { label: defaultLabel },
  })

  const handleOnSubmit = (data: Fields) => {
    onSubmit(data.label)
  }

  return (
    <Form onSubmit={handleSubmit(handleOnSubmit)}>
      <Input
        name='label'
        label='Group Name'
        placeholder='Enter a name for this group...'
        register={register}
        error={formState.errors.label?.message}
        autoFocus
        maxLength={64}
        onKeyDown={(e: React.KeyboardEvent) => {
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

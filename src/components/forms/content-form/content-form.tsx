import { noop } from 'lodash'
import { useForm } from 'react-hook-form'
import { type ContentFields, contentResolver } from './schema'
import { Form, TextArea } from '@/components/common'

export function ContentForm({
  title,
  onSubmit,
  defaultContent,
  placeholder = 'We did a great job!',
}: Readonly<any>) {
  const { formState, handleSubmit, register } = useForm<ContentFields>({
    resolver: contentResolver,
  })

  const handleOnSubmit = (data: ContentFields) => {
    onSubmit(data.content)
  }

  return (
    <Form title={title} onSubmit={handleSubmit(handleOnSubmit)}>
      <TextArea
        onClick={noop}
        name='content'
        data-testid='content-form__content'
        placeholder={placeholder}
        register={register}
        rows={5}
        maxLength={256}
        tabIndex={0}
        error={formState.errors.content?.message}
        defaultValue={defaultContent}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(handleOnSubmit)()
          }
        }}
        autoFocus
      />
      <button
        type='submit'
        className='w-full p-4 rounded-lg bg-primary/85 hover:bg-primary text-white font-bold cursor-pointer uppercase text-xl'
      >
        Submit
      </button>
    </Form>
  )
}

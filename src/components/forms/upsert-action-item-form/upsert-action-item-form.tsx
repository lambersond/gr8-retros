import { noop } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { type UpsertActionItemFields, upsertActionItemResolver } from './schema'
import { Dropdown, Form } from '@/components/common'
import { EmojiTextArea } from '@/components/emoji-completion'
import { SubmitButton } from '@/components/submit-button'
import type { UpsertActionItemFormProps } from './types'

export function UpsertActionItemForm({
  onSubmit,
  defaultContent,
  defaultAssignedToId,
  placeholder = 'We did a great job!',
  availableUsers = [],
  showDelete = false,
  onDelete,
}: Readonly<UpsertActionItemFormProps>) {
  const { control, formState, handleSubmit, register, setValue } =
    useForm<UpsertActionItemFields>({
      resolver: upsertActionItemResolver,
      defaultValues: {
        content: defaultContent,
        assignedToId: defaultAssignedToId,
      },
    })

  const { ref: rhfRef, onChange: rhfOnChange, ...rhfRest } = register('content')

  const handleOnSubmit = (data: UpsertActionItemFields) => {
    onSubmit(data.content, data.assignedToId)
  }

  return (
    <Form onSubmit={handleSubmit(handleOnSubmit)}>
      <EmojiTextArea
        {...rhfRest}
        ref={rhfRef}
        onClick={noop}
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
      {availableUsers.length > 0 && (
        <div className='mt-2 mb-6'>
          <Controller
            name='assignedToId'
            control={control}
            render={({ field }) => (
              <Dropdown
                options={availableUsers}
                label='assign to'
                placeholder='Select a Member'
                onSelect={selected => {
                  field.onChange(selected.value)
                }}
                width='w-full'
                size='md'
                defaultEmpty={!defaultAssignedToId}
                clearable
                defaultSelectedId={defaultAssignedToId}
              />
            )}
          />
        </div>
      )}
      <div className='flex justify-end items-center gap-0.5'>
        {showDelete && (
          <button
            onClick={onDelete}
            className='p-4 rounded-lg bg-danger/85 hover:bg-danger uppercase text-white font-bold cursor-pointer text-xl mr-2'
          >
            Delete
          </button>
        )}
        <SubmitButton />
      </div>
    </Form>
  )
}

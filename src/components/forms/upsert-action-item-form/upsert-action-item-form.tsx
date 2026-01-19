import { noop } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { type UpsertActionItemFields, upsertActionItemResolver } from './schema'
import { Dropdown, Form, TextArea } from '@/components/common'
import { SubmitButton } from '@/components/submit-button'
import type { UpsertActionItemFormProps } from './types'

export function UpsertActionItemForm({
  onSubmit,
  defaultContent,
  defaultAssignedToId,
  placeholder = 'We did a great job!',
  availableUsers = [],
}: Readonly<UpsertActionItemFormProps>) {
  const { control, formState, handleSubmit, register } =
    useForm<UpsertActionItemFields>({
      resolver: upsertActionItemResolver,
    })

  const handleOnSubmit = (data: UpsertActionItemFields) => {
    onSubmit(data.content, data.assignedToId)
  }

  return (
    <Form onSubmit={handleSubmit(handleOnSubmit)}>
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
      {availableUsers.length > 0 && (
        <div className='-mt-3 mb-6'>
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
      <SubmitButton />
    </Form>
  )
}

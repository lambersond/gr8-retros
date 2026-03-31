import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createBoardResolver, type CreateBoardFields } from './schema'
import { Form, Input } from '@/components/common'
import type { Availability, CreateBoardFormProps } from './types'

export function CreateBoardForm({ onSubmit }: Readonly<CreateBoardFormProps>) {
  const [availability, setAvailability] = useState<Availability>('idle')

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<CreateBoardFields>({
    resolver: createBoardResolver,
  })

  const boardName = watch('boardName')

  useEffect(() => {
    if (!boardName?.trim()) {
      setAvailability('idle')
      return
    }

    setAvailability('checking')

    const timeout = setTimeout(async () => {
      const response = await fetch(
        `/api/board/check?name=${encodeURI(boardName.trim())}`,
      )
      const { available } = await response.json()
      setAvailability(available ? 'available' : 'unavailable')
    }, 250)

    return () => clearTimeout(timeout)
  }, [boardName])

  const handleOnSubmit = useCallback(
    (data: CreateBoardFields) => {
      onSubmit({ boardName: data.boardName })
      reset()
      setAvailability('idle')
    },
    [onSubmit, reset],
  )

  const isSubmitDisabled = availability !== 'available'

  return (
    <Form onSubmit={handleSubmit(handleOnSubmit)}>
      <Input
        label='Board Name'
        {...register('boardName')}
        error={errors.boardName?.message}
        hint={<AvailabilityHint availability={availability} />}
      />

      <div className='flex justify-end'>
        <button
          className='not-disabled:cursor-pointer rounded-lg bg-primary/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:not-disabled:bg-primary disabled:cursor-not-allowed disabled:opacity-50'
          disabled={isSubmitDisabled}
          type='submit'
        >
          Create board
        </button>
      </div>
    </Form>
  )
}

function AvailabilityHint({
  availability,
}: Readonly<{ availability: Availability }>) {
  const config: Partial<
    Record<Availability, { text: string; className: string }>
  > = {
    available: { text: '✓ Name is available', className: 'text-success' },
    checking: {
      text: 'Checking availability…',
      className: 'text-text-primary',
    },
    unavailable: { text: '✗ Name is already taken', className: 'text-danger' },
  }

  const hint = config[availability]
  if (!hint) return

  return <p className={`text-xs ${hint.className}`}>{hint.text}</p>
}

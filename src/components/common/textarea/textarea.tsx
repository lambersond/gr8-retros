import clsx from 'classnames'
import type { TextAreaProps } from './types'

export function TextArea({
  label,
  error,
  register,
  className = '',
  name = 'textarea',
  registerOptions,
  ...props
}: Readonly<TextAreaProps>) {
  const classes = clsx(
    'mt-1 block w-full appearance-none rounded-md bg-transparent border border-border focus:border-secondary px-3 py-2 outline-none placeholder:text-text-secondary',
    className,
  )

  return (
    <div className='flex flex-col gap-1 mb-2'>
      {!!label && (
        <label
          className='text-sm text-text-secondary font-bold uppercase'
          htmlFor={name}
        >
          {label}
          {props.required && <sup>*</sup>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        className={classes}
        {...register?.(name, registerOptions)}
        {...props}
      />
      <p className='text-danger text-xs italic h-4 mb-2'>{error}</p>
    </div>
  )
}

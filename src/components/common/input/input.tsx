import clsx from 'clsx'
import type { InputProps } from './types'

export function Input({
  label,
  error,
  register,
  className = '',
  name = 'input',
  width = 'full',
  disabled = false,
  registerOptions,
  containerClassName = '',
  hint,
  hideError = false,
  ...props
}: Readonly<InputProps>) {
  const classes = clsx(
    'mt-1 block w-full appearance-none rounded-md bg-transparent border border-border-light focus:border-primary px-3 py-2 outline-none placeholder:text-text-secondary bg-paper',
    {
      'border-error focus:border-error focus:ring-error': !!error,
      'border-border-light focus:border-primary focus:ring-primary': !error,
      'cursor-not-allowed text-platinum': disabled,
    },
    className,
  )

  return (
    <div
      className={clsx(
        { 'w-full': width === 'full', 'w-auto': width === 'auto' },
        'flex flex-col',
        containerClassName,
      )}
    >
      {!!label && (
        <label
          className='text-[10px] font-semibold text-text-secondary uppercase tracking-widest'
          htmlFor={name}
        >
          {label}
          {props.required && <sup>*</sup>}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={classes}
        disabled={disabled}
        {...register?.(name, registerOptions)}
        {...props}
      />
      {!!hint && (
        <span className='text-text-secondary text-xs italic h-4 mb-2'>
          {hint}
        </span>
      )}
      {!hideError && (
        <p className='text-danger text-xs italic h-4 mb-2'>{error}</p>
      )}
    </div>
  )
}

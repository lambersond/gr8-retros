import type { InputHTMLAttributes } from 'react'
import type {
  FieldValue,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form'

export type Size = 'sm' | 'md' | 'lg'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  name?: string
  width?: 'full' | 'auto'
  hint?: string
  containerClassName?: string
  register?: UseFormRegister<FieldValue<any>>
  registerOptions?: RegisterOptions
}

export interface SwitchProps
  extends Omit<InputProps, 'type' | 'error' | 'size' | 'color'> {
  label?: string
  labelSize?: Size
  defaultChecked?: boolean
  labelClassName?: string
  size?: Size
  orientation?: 'horizontal' | 'vertical'
  intent?:
    | 'primary'
    | 'normal'
    | 'warning'
    | 'danger'
    | 'success'
    | 'info'
    | 'disabled'
  leftText?: string
  rightText?: string
}

export interface CheckboxProps
  extends Omit<InputProps, 'type' | 'error' | 'size'> {
  label: string
  defaultChecked?: boolean
  labelClassName?: string
  size?: Size
}

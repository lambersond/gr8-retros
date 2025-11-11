import type { InputHTMLAttributes } from 'react'
import type {
  FieldValue,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  name?: string
  register?: UseFormRegister<FieldValue<any>>
  registerOptions?: RegisterOptions
}

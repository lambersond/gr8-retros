import type { TextareaHTMLAttributes } from 'react'
import type {
  FieldValue,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form'

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  name?: string
  register?: UseFormRegister<FieldValue<any>>
  registerOptions?: RegisterOptions
}

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const schema = z.object({
  label: z
    .string()
    .min(1, 'Group name is required')
    .max(128, 'Max 128 characters'),
})

export type Fields = z.infer<typeof schema>
export const resolver = zodResolver(schema)

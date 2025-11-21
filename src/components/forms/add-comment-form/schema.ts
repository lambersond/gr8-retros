import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const contentSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(255, 'Content cannot exceed 255 characters')
    .optional(),
})

export type ContentFields = z.infer<typeof contentSchema>
export const contentResolver = zodResolver(contentSchema)

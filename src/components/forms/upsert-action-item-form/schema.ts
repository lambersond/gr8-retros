import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const upsertActionItemSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(255, 'Content cannot exceed 255 characters')
    .optional(),
  assignedToId: z.string().optional(),
})

export type UpsertActionItemFields = z.infer<typeof upsertActionItemSchema>
export const upsertActionItemResolver = zodResolver(upsertActionItemSchema)

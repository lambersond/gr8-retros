import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const createBoardSchema = z.object({
  boardId: z
    .string()
    .min(1, 'Board ID is required')
    .max(255, 'Board ID cannot exceed 255 characters'),
  boardName: z
    .string()
    .min(1, 'Board name is required')
    .max(255, 'Board name cannot exceed 255 characters'),
})

export type CreateBoardFields = z.infer<typeof createBoardSchema>
export const createBoardResolver = zodResolver(createBoardSchema)

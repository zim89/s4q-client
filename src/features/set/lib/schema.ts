import { z } from 'zod'
import { languageLevels } from '@/shared/constants'

// Schema for new card creation
export const newCardSchema = z.object({
  term: z
    .string()
    .min(1, 'Term is required')
    .min(2, 'Term must be at least 2 characters')
    .max(200, 'Term must not exceed 200 characters'),
  translate: z
    .string()
    .min(1, 'Translation is required')
    .min(2, 'Translation must be at least 2 characters')
    .max(200, 'Translation must not exceed 200 characters'),
  definition: z
    .string()
    .min(1, 'Definition is required')
    .min(10, 'Definition must be at least 10 characters')
    .max(500, 'Definition must not exceed 500 characters'),
})

// Schema for set card (either existing or new)
export const setCardSchema = z
  .object({
    existingCardId: z.string().optional(),
    newCard: newCardSchema.optional(),
  })
  .refine(data => data.existingCardId || data.newCard, {
    message: 'Either existing card ID or new card data must be provided',
    path: ['existingCardId'],
  })

export const createSetSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  isBase: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  level: z.enum(languageLevels).optional(),
  cards: z.array(setCardSchema).min(2, 'At least 2 cards are required'),
})

export type NewCardFormData = z.infer<typeof newCardSchema>
export type SetCardFormData = z.infer<typeof setCardSchema>
export type CreateSetFormData = z.infer<typeof createSetSchema>

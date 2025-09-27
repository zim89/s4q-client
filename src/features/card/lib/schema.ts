import { z } from 'zod'
import {
  cardDifficulties,
  contentStatuses,
  contentTypes,
  languageLevels,
  partsOfSpeech,
  verbTypes,
} from '@/shared/constants'
import { type SchemaKeys, extractSchemaKeys } from '@/shared/utils'

// Schema for card creation
export const createCardSchema = z.object({
  // Core fields
  term: z
    .string()
    .min(1, 'Term is required')
    .min(2, 'Term must be at least 2 characters')
    .max(200, 'Term must not exceed 200 characters'),
  translate: z
    .string()
    .min(1, 'Translation is required')
    .min(2, 'Translation must be at least 2 characters')
    .max(200, 'Translation must not exceed 200 characters')
    .optional(),
  definition: z
    .string()
    .min(10, 'Definition must be at least 10 characters')
    .max(500, 'Definition must not exceed 500 characters')
    .optional(),
  example: z
    .string()
    .max(1000, 'Example must not exceed 1000 characters')
    .optional(),

  // Language and grammar
  languageId: z.string().optional(),
  partOfSpeech: z
    .enum(Object.values(partsOfSpeech) as [string, ...string[]])
    .optional(),
  transcription: z
    .string()
    .max(100, 'Transcription must not exceed 100 characters')
    .optional(),
  grammaticalGender: z
    .string()
    .max(50, 'Grammatical gender must not exceed 50 characters')
    .optional(),

  // Media
  imageUrl: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'Image URL must not exceed 500 characters')
    .optional(),
  audioUrl: z
    .string()
    .url('Must be a valid URL')
    .max(500, 'Audio URL must not exceed 500 characters')
    .optional(),

  // Metadata
  difficulty: z
    .enum(Object.values(cardDifficulties) as [string, ...string[]])
    .optional(),
  contentType: z
    .enum(Object.values(contentTypes) as [string, ...string[]])
    .optional(),
  contentStatus: z
    .enum(Object.values(contentStatuses) as [string, ...string[]])
    .optional(),
  level: z
    .enum(Object.values(languageLevels) as [string, ...string[]])
    .optional(),
  isGlobal: z.boolean().optional(),

  // Verb-specific fields
  verbType: z
    .enum(Object.values(verbTypes) as [string, ...string[]])
    .optional(),
  pastSimple: z
    .string()
    .max(200, 'Past simple must not exceed 200 characters')
    .optional(),
  pastParticiple: z
    .string()
    .max(200, 'Past participle must not exceed 200 characters')
    .optional(),
  irregularVerbId: z.string().optional(),

  // Relationships
  ruleId: z.string().optional(),

  // Source
  sourceProvider: z
    .string()
    .max(100, 'Source provider must not exceed 100 characters')
    .optional(),
  sourceId: z
    .string()
    .max(100, 'Source ID must not exceed 100 characters')
    .optional(),
})

export type CreateCardFormData = z.infer<typeof createCardSchema>

// Константы полей формы, извлеченные из схемы
export const cardFormFields = extractSchemaKeys(createCardSchema)

// Тип для ключей полей формы
export type CardFormField = SchemaKeys<typeof createCardSchema.shape>

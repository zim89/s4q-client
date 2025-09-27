import { contentStatuses, contentTypes } from '@/shared/constants'

/**
 * Default values for card creation
 */
export const defaultCardForm = {
  // Core fields
  term: '',
  translate: '',
  definition: '',
  example: '',
  transcription: '',
  imageUrl: '',
  audioUrl: '',

  // Language and grammar
  languageId: undefined,
  partOfSpeech: undefined,
  grammaticalGender: '',

  // Metadata
  difficulty: undefined,
  contentType: contentTypes.language,
  contentStatus: contentStatuses.draft,
  level: undefined,
  isGlobal: true,

  // Verb-specific fields
  verbType: undefined,
  pastSimple: '',
  pastParticiple: '',
  irregularVerbId: undefined,

  // Relationships
  ruleId: undefined,

  // Source
  sourceProvider: '',
  sourceId: '',
}

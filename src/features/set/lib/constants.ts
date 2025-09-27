import { contentStatuses, contentTypes } from '@/shared/constants'

/**
 * Default values for new card creation
 */
export const defaultNewCard = {
  term: '',
  translate: '',
  definition: '',
  example: '',
  transcription: '',
  imageUrl: '',
  audioUrl: '',

  partOfSpeech: undefined,
  level: undefined,
  difficulty: undefined,

  isGlobal: true,

  contentType: contentTypes.language,
  contentStatus: contentStatuses.draft,

  verbType: undefined,
  irregularVerbId: undefined,
  pastSimple: '',
  pastParticiple: '',

  grammaticalGender: '',
  languageId: undefined,
  ruleId: undefined,
  sourceProvider: '',
  sourceId: '',
}

/**
 * Default values for set creation form
 */
export const defaultSetForm = {
  name: '',
  description: '',
  isBase: undefined,
  isPublic: undefined,
  level: undefined,
  cards: [
    { newCard: { ...defaultNewCard } },
    { newCard: { ...defaultNewCard } },
  ],
}

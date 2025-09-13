/**
 * User roles in the system
 */
export const userRoles = {
  admin: 'ADMIN',
  user: 'USER',
  manager: 'MANAGER',
  premium: 'PREMIUM',
} as const

export type UserRole = (typeof userRoles)[keyof typeof userRoles]

/**
 * Card difficulty levels
 */
export const cardDifficulties = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
} as const

export type CardDifficulty =
  (typeof cardDifficulties)[keyof typeof cardDifficulties]

/**
 * Parts of speech for language learning
 */
export const partsOfSpeech = {
  noun: 'NOUN',
  verb: 'VERB',
  adjective: 'ADJECTIVE',
  adverb: 'ADVERB',
  pronoun: 'PRONOUN',
  preposition: 'PREPOSITION',
  conjunction: 'CONJUNCTION',
  interjection: 'INTERJECTION',
  article: 'ARTICLE',
  numeral: 'NUMERAL',
} as const

export type PartOfSpeech = (typeof partsOfSpeech)[keyof typeof partsOfSpeech]

/**
 * Content types for different materials
 */
export const contentTypes = {
  notice: 'NOTICE',
  language: 'LANGUAGE',
  quiz: 'QUIZ',
} as const

export type ContentType = (typeof contentTypes)[keyof typeof contentTypes]

/**
 * Content status for publishing workflow
 */
export const contentStatuses = {
  draft: 'DRAFT',
  published: 'PUBLISHED',
  archived: 'ARCHIVED',
} as const

export type ContentStatus =
  (typeof contentStatuses)[keyof typeof contentStatuses]

/**
 * Language proficiency levels (CEFR)
 */
export const languageLevels = {
  a1: 'A1',
  a2: 'A2',
  b1: 'B1',
  b2: 'B2',
  c1: 'C1',
  c2: 'C2',
} as const

export type LanguageLevel = (typeof languageLevels)[keyof typeof languageLevels]

/**
 * Verb types for grammar classification
 */
export const verbTypes = {
  regular: 'REGULAR',
  irregular: 'IRREGULAR',
  mixed: 'MIXED',
  modal: 'MODAL',
  auxiliary: 'AUXILIARY',
  phrasal: 'PHRASAL',
  compound: 'COMPOUND',
} as const

export type VerbType = (typeof verbTypes)[keyof typeof verbTypes]

/**
 * Sortable fields for card queries
 */
export const cardSortFields = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  term: 'term',
  difficulty: 'difficulty',
  studyCount: 'studyCount',
  viewCount: 'viewCount',
  lastUsedAt: 'lastUsedAt',
} as const

export type CardSortField = (typeof cardSortFields)[keyof typeof cardSortFields]

/**
 * Sort order directions
 */
export const sortOrders = {
  asc: 'asc',
  desc: 'desc',
} as const

export type SortOrder = (typeof sortOrders)[keyof typeof sortOrders]

/**
 * Sortable fields for set queries
 */
export const setSortFields = {
  createdAt: 'createdAt',
  name: 'name',
  level: 'level',
} as const

export type SetSortField = (typeof setSortFields)[keyof typeof setSortFields]

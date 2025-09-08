export const userRoles = {
  admin: 'ADMIN',
  user: 'USER',
  manager: 'MANAGER',
  premium: 'PREMIUM',
} as const

export type UserRole = (typeof userRoles)[keyof typeof userRoles]

// Card constants
export const cardDifficulties = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
} as const

export type CardDifficulty =
  (typeof cardDifficulties)[keyof typeof cardDifficulties]

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

export const contentTypes = {
  notice: 'NOTICE',
  language: 'LANGUAGE',
  quiz: 'QUIZ',
} as const

export type ContentType = (typeof contentTypes)[keyof typeof contentTypes]

export const contentStatuses = {
  draft: 'DRAFT',
  published: 'PUBLISHED',
  archived: 'ARCHIVED',
} as const

export type ContentStatus =
  (typeof contentStatuses)[keyof typeof contentStatuses]

export const languageLevels = {
  a1: 'A1',
  a2: 'A2',
  b1: 'B1',
  b2: 'B2',
  c1: 'C1',
  c2: 'C2',
} as const

export type LanguageLevel = (typeof languageLevels)[keyof typeof languageLevels]

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

// Card sort fields
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

// Sort orders
export const sortOrders = {
  asc: 'asc',
  desc: 'desc',
} as const

export type SortOrder = (typeof sortOrders)[keyof typeof sortOrders]

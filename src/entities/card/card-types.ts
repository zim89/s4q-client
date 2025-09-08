import type {
  CardDifficulty,
  CardSortField,
  ContentStatus,
  ContentType,
  LanguageLevel,
  PartOfSpeech,
  SortOrder,
  VerbType,
} from '@/shared/constants'

// ==============================
// REQUEST PARAMETERS
// ==============================

/** Parameters for card requests */
export interface CardParams {
  page?: number
  limit?: number
  difficulty?: CardDifficulty
  partOfSpeech?: PartOfSpeech
  search?: string
  sort?: CardSortField
  order?: SortOrder
}

// ==============================
// MAIN TYPES
// ==============================

/** Main card entity */
export interface Card {
  id: string
  createdAt: Date
  updatedAt: Date

  // Core fields
  term: string
  slug: string
  definition: string | null
  partOfSpeech: PartOfSpeech | null
  transcription: string | null

  // Media fields
  imageUrl: string | null
  audioUrl: string | null

  // Metadata fields
  isGlobal: boolean
  grammaticalGender: string | null
  difficulty: CardDifficulty | null
  contentType: ContentType | null
  contentStatus: ContentStatus | null

  // Relationship fields
  userId: string | null
  languageId: string | null
  level: LanguageLevel | null
  ruleId: string | null
  verbType: VerbType | null
  irregularVerbId: string | null

  // Source fields
  sourceProvider: string | null
  sourceId: string | null

  // Statistics fields
  studyCount: number
  viewCount: number
  lastUsedAt: Date | null
}

// ==============================
// ADDITIONAL TYPES
// ==============================

/** Creating card */
export interface CreateCardDto {
  // Core fields
  term: string
  definition?: string
  partOfSpeech?: PartOfSpeech
  transcription?: string

  // Media fields
  imageUrl?: string
  audioUrl?: string

  // Metadata fields
  isGlobal?: boolean
  grammaticalGender?: string
  difficulty?: CardDifficulty
  contentType?: ContentType
  contentStatus?: ContentStatus

  // Relationship fields
  languageId?: string
  level?: LanguageLevel
  ruleId?: string
  verbType?: VerbType
  irregularVerbId?: string

  // Source fields
  sourceProvider?: string
  sourceId?: string
}

/** Updating card */
export interface UpdateCardDto {
  // Core fields
  term?: string
  definition?: string
  partOfSpeech?: PartOfSpeech
  transcription?: string

  // Media fields
  imageUrl?: string
  audioUrl?: string

  // Metadata fields
  isGlobal?: boolean
  grammaticalGender?: string
  difficulty?: CardDifficulty
  contentType?: ContentType
  contentStatus?: ContentStatus

  // Relationship fields
  languageId?: string
  level?: LanguageLevel
  ruleId?: string
  verbType?: VerbType
  irregularVerbId?: string

  // Source fields
  sourceProvider?: string
  sourceId?: string
}

import type {
  ContentStatus,
  LanguageLevel,
  SetSortField,
  SortOrder,
} from '@/shared/constants'

// ==============================
// REQUEST PARAMETERS
// ==============================

/** Parameters for set requests */
export interface SetParams {
  page?: number
  limit?: number
  level?: LanguageLevel
  search?: string
  sort?: SetSortField
  order?: SortOrder
}

// ==============================
// MAIN TYPES
// ==============================

/** Main set entity */
export interface Set {
  id: string
  createdAt: Date
  updatedAt: Date

  // Core fields
  name: string
  slug: string
  description: string | null
  isBase: boolean
  isPublic: boolean

  // Relationship fields
  userId: string | null
  languageId: string | null
  level: LanguageLevel | null
  contentStatus: ContentStatus | null

  // Fork fields
  originalSetId: string | null
}

// ==============================
// ADDITIONAL TYPES
// ==============================

/** Creating set */
export interface CreateSetDto {
  name: string
  description?: string
  isBase?: boolean
  isPublic?: boolean
  level?: LanguageLevel
}

/** Updating set */
export interface UpdateSetDto {
  name?: string
  description?: string
  isBase?: boolean
  isPublic?: boolean
  level?: LanguageLevel
}

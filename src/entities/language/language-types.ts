import type { PaginatedResponse } from '@/shared/types'

// ==============================
// REQUEST PARAMETERS
// ==============================

/** Parameters for language requests */
export interface LanguageParams {
  isEnabled?: boolean
  search?: string
}

// ==============================
// MAIN TYPES
// ==============================

/** Main language entity */
export interface Language {
  id: string
  createdAt: string
  name: string
  code: string
  isEnabled: boolean
}

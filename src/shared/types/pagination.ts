/**
 * Interface for paginated API responses
 *
 * Universal interface for returning collections with pagination metadata.
 * Used across all modules for consistent API.
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * Pagination parameters for requests
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

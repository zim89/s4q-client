import { apiRoutes, axiosClient } from '@/shared/api'
import type { PaginatedResponse } from '@/shared/types'
import type { Language, LanguageParams } from './language-types'

/**
 * Language requests class
 * Contains all HTTP methods for language operations
 */
class LanguageRequests {
  /**
   * Find many languages with pagination and filtering
   */
  async findMany(
    params?: LanguageParams,
  ): Promise<PaginatedResponse<Language>> {
    const searchParams = new URLSearchParams()

    // Add parameters to URL
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await axiosClient.get<PaginatedResponse<Language>>(
      `${apiRoutes.language.findMany}?${searchParams.toString()}`,
    )

    return response.data
  }
}

export const languageRequests = new LanguageRequests()

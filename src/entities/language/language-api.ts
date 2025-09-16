import type { PaginatedResponse } from '@/shared/types'
import { languageKeys } from './language-keys'
import { languageRequests } from './language-requests'
import type { Language, LanguageParams } from './language-types'

/**
 * API class for language
 * Contains HTTP methods and query options
 */
class LanguageApi {
  findMany: (params?: LanguageParams) => Promise<PaginatedResponse<Language>> =
    languageRequests.findMany

  /**
   * Query options for finding many languages
   */
  findManyOptions(params?: LanguageParams) {
    return {
      queryKey: languageKeys.list(params || {}),
      queryFn: () => this.findMany(params),
    }
  }
}

export const languageApi = new LanguageApi()

import { cardKeys } from './card-keys'
import { cardRequests } from './card-requests'
import type { CardParams, CardSearchParams } from './card-types'

/**
 * API class for cards
 * Contains HTTP methods and query options
 */
class CardApi {
  findMany = cardRequests.findMany
  findById = cardRequests.findById
  create = cardRequests.create
  update = cardRequests.update
  delete = cardRequests.delete
  searchByTerm = cardRequests.searchByTerm

  /**
   * Query options for finding card by ID
   */
  findByIdOptions(id: string) {
    return {
      queryKey: cardKeys.detail(id),
      queryFn: () => this.findById(id),
      enabled: !!id,
    }
  }

  /**
   * Query options for finding many cards
   */
  findManyOptions(params?: CardParams) {
    return {
      queryKey: cardKeys.list(params || {}),
      queryFn: () => this.findMany(params),
    }
  }

  /**
   * Query options for searching cards by term
   */
  searchByTermOptions(params: CardSearchParams) {
    return {
      queryKey: cardKeys.search(params),
      queryFn: () => this.searchByTerm(params),
      enabled: !!params.term && params.term.length >= 2,
    }
  }
}

export const cardApi = new CardApi()

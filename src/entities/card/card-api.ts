import { cardKeys } from './card-keys'
import { cardRequests } from './card-requests'
import type { CardParams } from './card-types'

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
}

export const cardApi = new CardApi()

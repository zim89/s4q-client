import { setKeys } from './set-keys'
import { setRequests } from './set-requests'
import type { SetParams } from './set-types'

/**
 * API class for set
 * Contains HTTP methods and query options
 */
class SetApi {
  findById = setRequests.findById
  findMany = setRequests.findMany
  create = setRequests.create
  update = setRequests.update
  delete = setRequests.delete
  addCardToSet = setRequests.addCardToSet
  removeCardFromSet = setRequests.removeCardFromSet

  /**
   * Query options for finding set by ID
   */
  findByIdOptions(id: string) {
    return {
      queryKey: setKeys.detail(id),
      queryFn: () => this.findById(id),
      enabled: !!id,
    }
  }

  /**
   * Query options for finding many sets
   */
  findManyOptions(params?: SetParams) {
    return {
      queryKey: setKeys.list(params || {}),
      queryFn: () => this.findMany(params),
    }
  }
}

export const setApi = new SetApi()

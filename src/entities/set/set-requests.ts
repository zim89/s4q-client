import { apiRoutes, axiosClient } from '@/shared/api'
import type { PaginatedResponse } from '@/shared/types'
import type {
  CreateSetDto,
  Set,
  SetParams,
  SetWithCards,
  UpdateSetDto,
} from './set-types'

/**
 * Set requests class
 * Contains all HTTP methods for set operations
 */
class SetRequests {
  /**
   * Find set by ID
   */
  async findById(id: string): Promise<Set> {
    const response = await axiosClient.get<Set>(apiRoutes.set.findOne(id))
    return response.data
  }

  /**
   * Find many sets with pagination and filtering
   */
  async findMany(params?: SetParams): Promise<PaginatedResponse<Set>> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await axiosClient.get<PaginatedResponse<Set>>(
      `${apiRoutes.set.findMany}?${searchParams.toString()}`,
    )

    return response.data
  }

  /**
   * Create new set
   */
  async create(data: CreateSetDto): Promise<SetWithCards> {
    const response = await axiosClient.post<SetWithCards>(
      apiRoutes.set.create,
      data,
    )
    return response.data
  }

  /**
   * Update set
   */
  async update(id: string, data: UpdateSetDto): Promise<Set> {
    const response = await axiosClient.patch<Set>(
      apiRoutes.set.update(id),
      data,
    )
    return response.data
  }

  /**
   * Delete set
   */
  async delete(id: string): Promise<void> {
    await axiosClient.delete(apiRoutes.set.delete(id))
  }

  /**
   * Add card to set
   */
  async addCardToSet(setId: string, cardId: string): Promise<void> {
    await axiosClient.post(apiRoutes.set.addCardToSet(setId, cardId))
  }

  /**
   * Remove card from set
   */
  async removeCardFromSet(setId: string, cardId: string): Promise<void> {
    await axiosClient.delete(apiRoutes.set.removeCardFromSet(setId, cardId))
  }
}

export const setRequests = new SetRequests()

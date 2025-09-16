import { apiRoutes, axiosClient } from '@/shared/api'
import type { PaginatedResponse } from '@/shared/types'
import type {
  Card,
  CardParams,
  CardSearchParams,
  CreateCardDto,
  SearchCard,
  UpdateCardDto,
} from './card-types'

/**
 * Card requests class
 * Contains all HTTP methods for card operations
 */
class CardRequests {
  /**
   * Find card by ID
   */
  async findById(id: string): Promise<Card> {
    const response = await axiosClient.get<Card>(apiRoutes.card.findOne(id))
    return response.data
  }

  /**
   * Find many cards with pagination and filtering
   */
  async findMany(params?: CardParams): Promise<PaginatedResponse<Card>> {
    const searchParams = new URLSearchParams()

    // Add parameters to URL
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
    }

    const response = await axiosClient.get<PaginatedResponse<Card>>(
      `${apiRoutes.card.findMany}?${searchParams.toString()}`,
    )

    return response.data
  }

  /**
   * Create new card
   */
  async create(data: CreateCardDto): Promise<Card> {
    const response = await axiosClient.post<Card>(apiRoutes.card.create, data)
    return response.data
  }

  /**
   * Update card
   */
  async update(id: string, data: UpdateCardDto): Promise<Card> {
    const response = await axiosClient.patch<Card>(
      apiRoutes.card.update(id),
      data,
    )
    return response.data
  }

  /**
   * Delete card
   */
  async delete(id: string): Promise<void> {
    await axiosClient.delete(apiRoutes.card.delete(id))
  }

  /**
   * Search cards by term for autocomplete
   */
  async searchByTerm(params: CardSearchParams): Promise<SearchCard[]> {
    const searchParams = new URLSearchParams()

    searchParams.append('term', params.term)
    if (params.limit !== undefined) {
      searchParams.append('limit', String(params.limit))
    }

    const response = await axiosClient.get<SearchCard[]>(
      `${apiRoutes.card.search}?${searchParams.toString()}`,
    )

    return response.data
  }
}

export const cardRequests = new CardRequests()

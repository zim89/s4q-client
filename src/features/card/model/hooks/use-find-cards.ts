'use client'

import { useQuery } from '@tanstack/react-query'
import { type CardParams, cardApi } from '@/entities/card'

/**
 * Hook for finding cards with filtering and pagination
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with data, loading, error states
 */
export const useFindCards = (params?: CardParams) => {
  return useQuery({
    ...cardApi.findManyOptions(params),
  })
}

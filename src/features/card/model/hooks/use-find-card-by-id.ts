'use client'

import { useQuery } from '@tanstack/react-query'
import { cardApi } from '@/entities/card'

/**
 * Hook for finding a single card by ID
 *
 * @param id - Card ID
 * @returns Query result with card data, loading, error states
 */
export const useFindCardById = (id: string) => {
  return useQuery({
    ...cardApi.findByIdOptions(id),
  })
}

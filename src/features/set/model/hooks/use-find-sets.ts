'use client'

import { useQuery } from '@tanstack/react-query'
import { type SetParams, setApi } from '@/entities/set'

/**
 * Hook for finding sets with filtering and pagination
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with data, loading, error states
 */
export const useFindSets = (params?: SetParams) => {
  return useQuery({
    ...setApi.findManyOptions(params),
  })
}

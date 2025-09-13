'use client'

import { useQuery } from '@tanstack/react-query'
import { setApi } from '@/entities/set'

/**
 * Hook for finding a single set by ID
 *
 * @param id - Set ID
 * @returns Query result with set data, loading, error states
 */
export const useFindSetById = (id: string) => {
  return useQuery({
    ...setApi.findByIdOptions(id),
  })
}

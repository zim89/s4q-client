'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { languageApi } from '@/entities/language'
import { useLanguageStore } from './language-store-provider'

/**
 * Hook for fetching and managing languages
 *
 * Uses Zustand store for caching and TanStack Query for data fetching.
 * Languages are cached in localStorage and only fetched once.
 *
 * @returns Object with languages data and loading state
 */
export const useLanguages = () => {
  const { languages, setLanguages } = useLanguageStore(state => state)

  const { data, isLoading, error } = useQuery({
    ...languageApi.findManyOptions({ isEnabled: true }),
    enabled: languages.length === 0, // Only fetch if not cached
    staleTime: Infinity, // Never stale - languages don't change
    gcTime: Infinity, // Cache forever
  })

  // Cache languages in store when fetched
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setLanguages(data.data)
    }
  }, [data, setLanguages])

  return {
    languages: languages.length > 0 ? languages : data?.data || [],
    isLoading,
    isError: !!error,
    error,
  }
}

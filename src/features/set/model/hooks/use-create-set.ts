'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { type CreateSetDto, type Set, setApi, setKeys } from '@/entities/set'
import { logError } from '@/shared/utils'

interface UseCreateSetOptions {
  onSuccess?: (data: Set) => void
  onError?: (error: Error, variables: CreateSetDto) => void
  onSettled?: () => void
}

/**
 * Hook for creating a new set
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useCreateSet = (options: UseCreateSetOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: setApi.create,

    // Retry logic
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: (data, _variables, _context) => {
      // Toast success notification
      toast.success('Set created successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: setKeys.all() })

      // Call success callback
      options.onSuccess?.(data)
    },

    onError: (error, variables, _context) => {
      // Log error
      logError('❌ [useCreateSet] Create error:', error)

      // Toast error notification
      toast.error('Failed to create set. Please try again.')

      // Call error callback
      options.onError?.(error, variables)
    },

    onSettled: () => {
      // Call settled callback
      options.onSettled?.()
    },
  })
}

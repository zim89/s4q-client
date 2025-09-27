'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type Card,
  type CreateCardDto,
  cardApi,
  cardKeys,
} from '@/entities/card'
import { logError } from '@/shared/utils'

interface UseCreateCardOptions {
  onSuccess?: (data: Card) => void
  onError?: (error: Error, variables: CreateCardDto) => void
  onSettled?: () => void
}

/**
 * Hook for creating a new card
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useCreateCard = (options: UseCreateCardOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cardApi.create,

    // Retry logic
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: (data, _variables, _context) => {
      // Toast success notification
      toast.success('Card created successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: cardKeys.all() })

      // Call success callback
      options.onSuccess?.(data)
    },

    onError: (error, variables, _context) => {
      // Log error
      logError('❌ [useCreateCard] Create error:', error)

      // Toast error notification
      toast.error('Failed to create card. Please try again.')

      // Call error callback
      options.onError?.(error, variables)
    },

    onSettled: () => {
      // Call settled callback
      options.onSettled?.()
    },
  })
}

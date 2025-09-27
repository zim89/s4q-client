'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { setApi, setKeys } from '@/entities/set'
import { logError } from '@/shared/utils'

interface UseAddCardToSetOptions {
  onSuccess?: (setId: string, cardId: string) => void
  onError?: (error: Error, variables: { setId: string; cardId: string }) => void
  onSettled?: () => void
}

/**
 * Hook for adding a card to a set
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useAddCardToSet = (options: UseAddCardToSetOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ setId, cardId }: { setId: string; cardId: string }) =>
      setApi.addCardToSet(setId, cardId),

    // Retry logic
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: (data, variables, _context) => {
      // Toast success notification
      toast.success('Card added to set successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: setKeys.detail(variables.setId),
      })
      queryClient.invalidateQueries({ queryKey: setKeys.all() })

      // Call success callback
      options.onSuccess?.(variables.setId, variables.cardId)
    },

    onError: (error, variables, _context) => {
      // Log error
      logError('❌ [useAddCardToSet] Add card error:', error)

      // Toast error notification
      toast.error('Failed to add card to set. Please try again.')

      // Call error callback
      options.onError?.(error, variables)
    },

    onSettled: () => {
      // Call settled callback
      options.onSettled?.()
    },
  })
}

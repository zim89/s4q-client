'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cardApi, cardKeys } from '@/entities/card'
import { logError } from '@/shared/utils'

interface UseDeleteCardOptions {
  onSuccess?: () => void
  onError?: (error: Error, variables: string) => void
  onSettled?: () => void
}

/**
 * Hook for deleting a card
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useDeleteCard = (options: UseDeleteCardOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cardApi.delete(id),

    // No retry for delete operations
    retry: false,

    onMutate: async id => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cardKeys.detail(id) })

      // Snapshot previous value
      const previousCard = queryClient.getQueryData(cardKeys.detail(id))

      // Optimistically remove from cache
      queryClient.removeQueries({ queryKey: cardKeys.detail(id) })

      // Return context for rollback
      return { previousCard, id }
    },

    onSuccess: (_data, _id, _context) => {
      // Toast success notification
      toast.success('Card deleted successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: cardKeys.all() })

      // Call success callback
      options.onSuccess?.()
    },

    onError: (error, id, context) => {
      // Log error
      logError('❌ [useDeleteCard] Delete error:', error)

      // Toast error notification
      toast.error('Failed to delete card. Please try again.')

      // Rollback on error
      if (context?.previousCard) {
        queryClient.setQueryData(cardKeys.detail(id), context.previousCard)
      }

      // Call error callback
      options.onError?.(error, id)
    },

    onSettled: (_data, _error, _id) => {
      // Always invalidate after error or success
      queryClient.invalidateQueries({ queryKey: cardKeys.all() })

      // Call settled callback
      options.onSettled?.()
    },
  })
}

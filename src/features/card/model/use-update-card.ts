'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  type Card,
  type UpdateCardDto,
  cardApi,
  cardKeys,
} from '@/entities/card'
import { logError } from '@/shared/utils'

interface UseUpdateCardOptions {
  onSuccess?: (data: Card) => void
  onError?: (
    error: Error,
    variables: { id: string; data: UpdateCardDto },
  ) => void
  onSettled?: () => void
}

/**
 * Hook for updating a card
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useUpdateCard = (options: UseUpdateCardOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardDto }) =>
      cardApi.update(id, data),

    // Retry logic
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cardKeys.detail(id) })

      // Snapshot previous value
      const previousCard = queryClient.getQueryData(cardKeys.detail(id))

      // Optimistically update
      if (previousCard) {
        queryClient.setQueryData(cardKeys.detail(id), {
          ...previousCard,
          ...data,
        })
      }

      // Return context for rollback
      return { previousCard }
    },

    onSuccess: (data, variables, _context) => {
      // Toast success notification
      toast.success('Card updated successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: cardKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: cardKeys.all() })

      // Call success callback
      options.onSuccess?.(data)
    },

    onError: (error, variables, context) => {
      // Log error
      logError('❌ [useUpdateCard] Update error:', error)

      // Toast error notification
      toast.error('Failed to update card. Please try again.')

      // Rollback on error
      if (context?.previousCard) {
        queryClient.setQueryData(
          cardKeys.detail(variables.id),
          context.previousCard,
        )
      }

      // Call error callback
      options.onError?.(error, variables)
    },

    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: cardKeys.detail(variables.id) })

      // Call settled callback
      options.onSettled?.()
    },
  })
}

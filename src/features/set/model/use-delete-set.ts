'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { setApi, setKeys } from '@/entities/set'
import { logError } from '@/shared/utils'

interface UseDeleteSetOptions {
  onSuccess?: (id: string) => void
  onError?: (error: Error, id: string) => void
  onSettled?: () => void
}

/**
 * Hook for deleting a set
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useDeleteSet = (options: UseDeleteSetOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: setApi.delete,

    // Retry logic
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onMutate: async id => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: setKeys.detail(id) })

      // Snapshot previous value
      const previousSet = queryClient.getQueryData(setKeys.detail(id))

      // Optimistically remove from cache
      queryClient.removeQueries({ queryKey: setKeys.detail(id) })

      // Return context for rollback
      return { previousSet, id }
    },

    onSuccess: (data, id, _context) => {
      // Toast success notification
      toast.success('Set deleted successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: setKeys.all() })

      // Call success callback
      options.onSuccess?.(id)
    },

    onError: (error, id, context) => {
      // Rollback on error
      if (context?.previousSet) {
        queryClient.setQueryData(setKeys.detail(id), context.previousSet)
      }

      // Log error
      logError('❌ [useDeleteSet] Delete error:', error)

      // Toast error notification
      toast.error('Failed to delete set. Please try again.')

      // Call error callback
      options.onError?.(error, id)
    },

    onSettled: (_data, _error, _id) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: setKeys.all() })

      // Call settled callback
      options.onSettled?.()
    },
  })
}

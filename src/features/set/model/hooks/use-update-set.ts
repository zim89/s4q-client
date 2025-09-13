'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { type Set, type UpdateSetDto, setApi, setKeys } from '@/entities/set'
import { logError } from '@/shared/utils'

interface UseUpdateSetOptions {
  onSuccess?: (data: Set) => void
  onError?: (error: Error, variables: UpdateSetDto & { id: string }) => void
  onSettled?: () => void
}

/**
 * Hook for updating an existing set
 *
 * @param options - Callback options for mutation lifecycle
 * @returns Mutation object with methods and states
 */
export const useUpdateSet = (options: UseUpdateSetOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateSetDto & { id: string }) =>
      setApi.update(id, data),

    // Retry logic
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onMutate: async ({ id, ...newData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: setKeys.detail(id) })

      // Snapshot previous value
      const previousSet = queryClient.getQueryData(setKeys.detail(id))

      // Optimistically update
      queryClient.setQueryData(setKeys.detail(id), (old: Set) => ({
        ...old,
        ...newData,
        updatedAt: new Date(),
      }))

      // Return context for rollback
      return { previousSet }
    },

    onSuccess: (data, variables, _context) => {
      // Toast success notification
      toast.success('Set updated successfully')

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: setKeys.all() })
      queryClient.invalidateQueries({ queryKey: setKeys.detail(variables.id) })

      // Call success callback
      options.onSuccess?.(data)
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousSet) {
        queryClient.setQueryData(
          setKeys.detail(variables.id),
          context.previousSet,
        )
      }

      // Log error
      logError('❌ [useUpdateSet] Update error:', error)

      // Toast error notification
      toast.error('Failed to update set. Please try again.')

      // Call error callback
      options.onError?.(error, variables)
    },

    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: setKeys.detail(variables.id) })

      // Call settled callback
      options.onSettled?.()
    },
  })
}

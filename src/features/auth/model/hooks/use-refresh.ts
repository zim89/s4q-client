'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { type AuthResponse, authApi, authKeys } from '@/entities/auth'
import { logError } from '@/shared/utils'
import { useAuthStore } from '../store/auth-store-provider'

interface UseRefreshTokenOptions {
  onSuccess?: (data: AuthResponse) => void
  onError?: (error: Error) => void
  onSettled?: () => void
}

/**
 * Hook for refreshing authentication token
 *
 * @param options - Options for configuring hook behavior
 * @returns Object with methods and states for token refresh
 */
export const useRefreshToken = (options: UseRefreshTokenOptions = {}) => {
  const queryClient = useQueryClient()
  const updateAccessToken = useAuthStore(state => state.updateAccessToken)
  const logout = useAuthStore(state => state.logout)

  return useMutation({
    mutationFn: authApi.refresh,

    // Retry logic for refresh - more attempts as it's critical
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),

    onSuccess: response => {
      // Toast success notification
      toast.success('Token successfully refreshed')

      // Update access token in store and cookies
      updateAccessToken(response.accessToken)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: authKeys.root })

      // Call success callback
      options.onSuccess?.(response)
    },

    onError: error => {
      // Log error
      logError('❌ Refresh token error:', error)

      // Toast error notification
      toast.error('Failed to refresh token. Please log in again.')

      // On refresh token error - clear authentication
      logout()

      // Call error callback
      options.onError?.(error)
    },

    onSettled: () => {
      // Always invalidate auth queries after completion
      queryClient.invalidateQueries({ queryKey: authKeys.root })

      // Call settled callback
      options.onSettled?.()
    },
  })
}

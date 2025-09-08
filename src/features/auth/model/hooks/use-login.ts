'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { toast } from 'sonner'
import { authApi } from '@/entities/auth/auth-api'
import { authKeys } from '@/entities/auth/auth-keys'
import type { AuthResponse, LoginDto } from '@/entities/auth/auth-types'
import { appRoutes } from '@/shared/config'
import { queryParamsKeys } from '@/shared/constants'
import { logError } from '@/shared/utils'
import {
  useAccessToken,
  useAuthStore,
  useUserId,
} from '../store/auth-store-provider'

interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void
  onError?: (error: Error, variables: LoginDto) => void
  onSettled?: () => void
}

/**
 * Hook for user login
 *
 * @param options - Options for configuring hook behavior
 * @returns Object with methods and states for login
 */
export const useLogin = (options: UseLoginOptions = {}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [redirect] = useQueryState(queryParamsKeys.redirect)
  const setAuth = useAuthStore(state => state.setAuth)

  const userId = useUserId()
  const accessToken = useAccessToken()

  return useMutation({
    mutationFn: authApi.login,

    // Retry logic for login - more attempts as it's a critical operation
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),

    onMutate: async () => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: authKeys.root })

      // Save previous state for rollback
      const previousAuth = {
        userId,
        accessToken,
      }

      return { previousAuth }
    },

    onSuccess: (response, _variables, _context) => {
      // Toast success notification
      toast.success('You have successfully logged in')

      // Save authentication to store and cookies
      setAuth({
        userId: response.user.id,
        accessToken: response.accessToken,
      })

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })

      // Redirect to home or previous page
      const redirectTo = redirect ?? appRoutes.workspace.index
      router.push(redirectTo)

      // Call success callback
      options.onSuccess?.(response)
    },

    onError: (error, _variables, context) => {
      // Log error
      logError('❌ Login error:', error)

      // Toast error notification
      toast.error('Failed to log in. Please check your email and password.')

      // Rollback on error - only if previous state was valid
      if (context?.previousAuth?.userId && context.previousAuth.accessToken) {
        setAuth({
          userId: context.previousAuth.userId,
          accessToken: context.previousAuth.accessToken,
        })
      }

      // Call error callback
      options.onError?.(error, _variables)
    },

    onSettled: () => {
      // Always invalidate auth queries after completion
      queryClient.invalidateQueries({ queryKey: authKeys.root })

      // Call settled callback
      options.onSettled?.()
    },
  })
}

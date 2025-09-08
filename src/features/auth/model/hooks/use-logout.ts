'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi, authKeys } from '@/entities/auth'
import { appRoutes } from '@/shared/config'
import { logWarn } from '@/shared/utils'
import { useAuthStore } from '../store/auth-store-provider'

interface UseLogoutOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
  onSettled?: () => void
}

/**
 * Хук для выхода пользователя из системы
 *
 * @param options - Опции для настройки поведения хука
 * @returns Объект с методами и состояниями для выхода
 */
export const useLogout = (options: UseLogoutOptions = {}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const logout = useAuthStore(state => state.logout)

  return useMutation({
    mutationFn: authApi.logout,

    // No retry for logout - it's not critical
    retry: false,

    onMutate: async () => {
      // Cancel outgoing queries
      await queryClient.cancelQueries()

      // Clear all cached data
      queryClient.clear()
    },

    onSuccess: () => {
      // Toast success notification
      toast.success('Вы успешно вышли из системы')

      // Clear local state (cookies and state)
      logout()

      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: authKeys.root })

      // Redirect to home page
      router.push('/')

      // Call success callback
      options.onSuccess?.()
    },

    onError: error => {
      // Ignore logout API errors - still clear local state
      logWarn('Logout API error:', error)

      // Toast API error notification
      toast.warning('Ошибка при выходе из системы, но локальная сессия очищена')

      // Clear local state even on error
      logout()

      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: authKeys.root })

      // Redirect to home page
      router.push(appRoutes.home)

      // Call error callback
      options.onError?.(error)
    },

    onSettled: () => {
      // Always clear cache after logout
      queryClient.clear()

      // Call settled callback
      options.onSettled?.()
    },
  })
}

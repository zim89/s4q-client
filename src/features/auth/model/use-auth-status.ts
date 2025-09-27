'use client'

import { useAuthStore } from './auth-store-provider'

export const useAuthStatus = () => {
  const { userId, accessToken } = useAuthStore(state => ({
    userId: state.userId,
    accessToken: state.accessToken,
  }))

  const isAuthenticated = !!(userId && accessToken)

  return {
    isAuthenticated,
    userId,
  }
}

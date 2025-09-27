'use client'

import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import { authCookies } from '@/shared/utils'

export type AuthState = {
  userId: string | null
  accessToken: string | null
}

export type AuthActions = {
  setAuth: (auth: { userId: string; accessToken: string }) => void
  updateAccessToken: (accessToken: string) => void
  logout: () => void
}

export type AuthStore = AuthState & AuthActions

const defaultAuthState: AuthState = {
  userId: null,
  accessToken: null,
}

export const createAuthStore = (initState: AuthState = defaultAuthState) => {
  return createStore<AuthStore>()(
    persist(
      (set, get) => ({
        ...initState,

        setAuth: ({ userId, accessToken }) => {
          // Save to cookies for SSR/middleware
          authCookies.set({
            accessToken,
            userId,
          })

          // Save to state for client
          set({ userId, accessToken })
        },

        updateAccessToken: accessToken => {
          const { userId } = get()
          if (userId) {
            // Update cookies
            authCookies.set({
              accessToken,
              userId,
            })

            // Update state
            set({ accessToken })
          }
        },

        logout: () => {
          authCookies.clear()
          set(defaultAuthState)
        },
      }),
      {
        name: 's4q-auth-store', // Simple key for localStorage
        storage: createJSONStorage(() => localStorage),
        // Save only basic state
        partialize: state => ({
          userId: state.userId,
          accessToken: state.accessToken,
        }),
        onRehydrateStorage: () => state => {
          // When restoring from localStorage sync with cookies
          if (state?.accessToken && state?.userId) {
            authCookies.set({
              accessToken: state.accessToken,
              userId: state.userId,
            })
          }
        },
      },
    ),
  )
}

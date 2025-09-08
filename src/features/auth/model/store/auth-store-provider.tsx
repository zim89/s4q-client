'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { type AuthStore, createAuthStore } from './auth-store'

type AuthStoreApi = ReturnType<typeof createAuthStore>

const AuthStoreContext = createContext<AuthStoreApi | undefined>(undefined)

interface Props {
  children: ReactNode
  initialUserId?: string | null
  initialAccessToken?: string | null
}

export const AuthStoreProvider = ({
  children,
  initialUserId = null,
  initialAccessToken = null,
}: Props) => {
  const storeRef = useRef<AuthStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createAuthStore({
      userId: initialUserId,
      accessToken: initialAccessToken,
    })
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  )
}

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext)

  if (!authStoreContext) {
    throw new Error('useAuthStore must be used within AuthStoreProvider')
  }

  return useStore(authStoreContext, selector)
}

// Selectors for basic values
const selectAuth = (state: AuthStore) => ({
  userId: state.userId,
  accessToken: state.accessToken,
  setAuth: state.setAuth,
  updateAccessToken: state.updateAccessToken,
  logout: state.logout,
})

// Convenient hooks
export const useAuth = () => useAuthStore(selectAuth)
export const useUserId = () => useAuthStore(state => state.userId)
export const useAccessToken = () => useAuthStore(state => state.accessToken)

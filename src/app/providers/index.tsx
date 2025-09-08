'use client'

import { useEffect } from 'react'
import { AuthStoreProvider } from '@/features/auth'
import { setupBFCacheHandlers } from '@/shared/utils'
import { QueryProvider } from './query-provider'

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Setup bfcache handlers only on client
    if (typeof window !== 'undefined') {
      setupBFCacheHandlers()
    }
  }, [])

  return (
    <QueryProvider>
      <AuthStoreProvider>{children}</AuthStoreProvider>
    </QueryProvider>
  )
}

'use client'

import { useEffect } from 'react'
import { AuthStoreProvider } from '@/features/auth'
import { LanguageProvider } from '@/features/language'
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
      <LanguageProvider>
        <AuthStoreProvider>{children}</AuthStoreProvider>
      </LanguageProvider>
    </QueryProvider>
  )
}

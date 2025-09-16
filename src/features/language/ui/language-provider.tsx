'use client'

import { useEffect } from 'react'
import { useLanguages } from '../model'
import { LanguageStoreProvider } from '../model/language-store-provider'

interface LanguageProviderProps {
  children: React.ReactNode
}

/**
 * Language Provider
 *
 * Provides language store context and automatically loads languages on app startup.
 * This ensures languages are available throughout the app without manual loading.
 */
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  return (
    <LanguageStoreProvider>
      <LanguageProviderInner>{children}</LanguageProviderInner>
    </LanguageStoreProvider>
  )
}

const LanguageProviderInner = ({ children }: LanguageProviderProps) => {
  const { isLoading, isError } = useLanguages()

  // Optional: Log loading states for debugging
  useEffect(() => {
    if (isLoading) {
      console.log('🌍 Loading languages...')
    }
    if (isError) {
      console.error('❌ Failed to load languages')
    }
  }, [isLoading, isError])

  return <>{children}</>
}

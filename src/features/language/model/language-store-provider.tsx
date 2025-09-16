'use client'

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { useStore } from 'zustand'
import { type LanguageStore, createLanguageStore } from './language-store'

export type LanguageStoreApi = ReturnType<typeof createLanguageStore>

export const LanguageStoreContext = createContext<LanguageStoreApi | undefined>(
  undefined,
)

export interface LanguageStoreProviderProps {
  children: ReactNode
}

export const LanguageStoreProvider = ({
  children,
}: LanguageStoreProviderProps) => {
  const storeRef = useRef<LanguageStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createLanguageStore()
  }

  // Hydrate store on client side
  useEffect(() => {
    if (storeRef.current && 'persist' in storeRef.current) {
      storeRef.current.persist.rehydrate()
    }
  }, [])

  return (
    <LanguageStoreContext.Provider value={storeRef.current}>
      {children}
    </LanguageStoreContext.Provider>
  )
}

export const useLanguageStore = <T,>(
  selector: (store: LanguageStore) => T,
): T => {
  const languageStoreContext = useContext(LanguageStoreContext)

  if (!languageStoreContext) {
    throw new Error(
      `useLanguageStore must be used within LanguageStoreProvider`,
    )
  }

  return useStore(languageStoreContext, selector)
}

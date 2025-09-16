import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import type { Language } from '@/entities/language'

export type LanguageState = {
  languages: Language[]
}

export type LanguageActions = {
  setLanguages: (languages: Language[]) => void
  clearLanguages: () => void
}

export type LanguageStore = LanguageState & LanguageActions

const defaultInitState: LanguageState = {
  languages: [],
}

export const createLanguageStore = (
  initState: LanguageState = defaultInitState,
) => {
  return createStore<LanguageStore>()(
    persist(
      set => ({
        ...initState,
        setLanguages: languages => set({ languages }),
        clearLanguages: () => set({ languages: [] }),
      }),
      {
        name: 's4q-language-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({
          languages: state.languages,
        }),
        skipHydration: true,
      },
    ),
  )
}

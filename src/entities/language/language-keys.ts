import type { LanguageParams } from './language-types'

export const languageKeys = {
  root: ['language'] as const,

  all: () => [...languageKeys.root, 'list'] as const,
  lists: () => [...languageKeys.all()] as const,
  list: (filters: LanguageParams) =>
    [...languageKeys.lists(), { filters }] as const,
} as const

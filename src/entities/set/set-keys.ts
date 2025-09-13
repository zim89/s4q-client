import type { SetParams } from './set-types'

export const setKeys = {
  root: ['set'] as const,

  all: () => [...setKeys.root, 'list'] as const,
  lists: () => [...setKeys.all()] as const,
  list: (filters: SetParams) => [...setKeys.lists(), { filters }] as const,

  details: () => [...setKeys.root, 'detail'] as const,
  detail: (id: string) => [...setKeys.details(), id] as const,
} as const

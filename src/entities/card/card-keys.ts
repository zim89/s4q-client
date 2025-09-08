import type { CardParams } from './card-types'

export const cardKeys = {
  root: ['card'] as const,

  all: () => [...cardKeys.root, 'list'] as const,
  lists: () => [...cardKeys.all()] as const,
  list: (filters: CardParams) => [...cardKeys.lists(), { filters }] as const,

  details: () => [...cardKeys.root, 'detail'] as const,
  detail: (id: string) => [...cardKeys.details(), id] as const,
} as const

import { useQuery } from '@tanstack/react-query'
import { cardApi } from '@/entities/card'
import type { CardSearchParams } from '@/entities/card'

export const useSearchCards = (params: CardSearchParams) => {
  return useQuery({
    ...cardApi.searchByTermOptions(params),
    enabled: !!params.term && params.term.length >= 2,
  })
}

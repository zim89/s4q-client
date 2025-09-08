import { QueryClient } from '@tanstack/react-query'

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Data remains fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
        // Cached for 10 minutes (renamed from cacheTime)
        gcTime: 1000 * 60 * 10,
        // Disable automatic refetching for better UX
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: 'always',
        // Retry logic with exponential backoff
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors (client errors)
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status: number }).status
            if (status >= 400 && status < 500) {
              return false
            }
          }
          // Retry up to 3 times for other errors
          return failureCount < 3
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
        // Network mode for better offline support
        networkMode: 'online',
      },
      mutations: {
        // Fewer retries for mutations
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status: number }).status
            if (status >= 400 && status < 500) {
              return false
            }
          }
          // Retry once for network errors
          return failureCount < 1
        },
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
        // Network mode for mutations
        networkMode: 'online',
      },
    },
  })

let browserQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return createQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient()
  }

  return browserQueryClient
}

import {
  type FetchQueryOptions,
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { logError } from '@/shared/utils'

/**
 * Configuration for server-side data prefetching
 */
interface PrefetchConfig {
  /** Time in milliseconds during which data is considered fresh (default: 5 minutes) */
  staleTime?: number
  /** Time in milliseconds during which data is stored in cache (default: 15 minutes) */
  gcTime?: number
  /** Number of retry attempts on error (default: 1) */
  retry?: number
  /** Request timeout in milliseconds (default: 5 seconds) */
  timeout?: number
}

/**
 * Result of creating server-side prefetch
 */
interface PrefetchResult {
  /** QueryClient instance with configured parameters */
  queryClient: QueryClient
  /** Function for dehydrating cache state */
  dehydrate: () => ReturnType<typeof dehydrate>
  /** Component for hydrating state on client */
  HydrationBoundary: typeof HydrationBoundary
}

/**
 * Default configuration for server-side prefetch
 */
const DEFAULT_CONFIG: Required<PrefetchConfig> = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
  retry: 1,
  timeout: 5000, // 5 seconds
}

/**
 * Creates QueryClient with data prefetching for SSR
 *
 * This function is intended for use in Next.js server components.
 * It creates a QueryClient with configured caching parameters and performs
 * prefetch of the specified query for subsequent hydration on the client.
 *
 * @template TData - Type of data returned by the query
 * @param queryOptions - Query options for prefetching
 * @param config - Additional configuration (optional)
 * @returns Promise with object containing QueryClient, dehydrate function and HydrationBoundary component
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { dehydrate, HydrationBoundary } = await createServerPrefetchClient(
 *   serviceApi.getServiceByIdQueryOptions({
 *     id: 123,
 *     lang: 'ru'
 *   })
 * )
 *
 * return (
 *   <HydrationBoundary state={dehydrate()}>
 *     <ServiceDetails serviceId={123} />
 *   </HydrationBoundary>
 * )
 * ```
 *
 * @example
 * ```typescript
 * // With custom configuration
 * const { dehydrate, HydrationBoundary } = await createServerPrefetchClient(
 *   userApi.getUserQueryOptions({ id: 456 }),
 *   {
 *     staleTime: 10 * 60 * 1000, // 10 minutes
 *     timeout: 10000,            // 10 seconds
 *     retry: 2                   // 2 attempts
 *   }
 * )
 * ```
 *
 * @example
 * ```typescript
 * // For data that updates frequently
 * const { dehydrate, HydrationBoundary } = await createServerPrefetchClient(
 *   newsApi.getLatestNewsQueryOptions(),
 *   {
 *     staleTime: 60 * 1000,      // 1 minute
 *     gcTime: 5 * 60 * 1000,     // 5 minutes
 *     retry: 0                   // no retry attempts
 *   }
 * )
 * ```
 */
export async function createServerPrefetchClient<TData = unknown>(
  queryOptions: FetchQueryOptions<TData>,
  config: PrefetchConfig = {},
): Promise<PrefetchResult> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: finalConfig.staleTime,
        gcTime: finalConfig.gcTime,
        retry: finalConfig.retry,
      },
    },
  })

  try {
    await queryClient.prefetchQuery({
      ...queryOptions,
      meta: {
        ...queryOptions.meta,
        timeout: finalConfig.timeout,
      },
    })
  } catch (error) {
    logError('Failed to prefetch query:', {
      queryKey: queryOptions.queryKey,
      error: error instanceof Error ? error.message : error,
    })
  }

  return {
    queryClient,
    dehydrate: () => dehydrate(queryClient),
    HydrationBoundary,
  }
}
